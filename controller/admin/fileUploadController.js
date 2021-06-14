const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const validUrl = require('valid-url');

const utils = require("../../utils/messages")

let defaultDirectory = 'uploads'
let allowedFileTypes = [ 'png', 'jpeg' ];
let maxFileSize = 23; //In Megabyte

const upload = async (req, res) => {
    try {
        // Create Directory if not exist.
        await makeDirectory(defaultDirectory);

        // Setting up formidable options.
        const form = new formidable.IncomingForm();
        form.multiples = true;
        form.maxFileSize = 300 * 1024 * 1024; //300 MB
        form.maxFieldsSize = 100 * 1024 * 1024; //50 MB
       
        //Upload File one by one
        const uploadFileRes = await new Promise(async (resolve, reject) => {
             
            form.parse(req, async function (err, fields, files) {
              
                let filePaths = [];
                let fileCount = 1;
                
                let fileArr = [];
                if(files["file[]"].size == 0){
                    resolve({
                        "err": "Please Select any one File",
                        "status": false
                    })
                }
                if (!Array.isArray(files["file[]"])) {
                    fileArr.push(files["file[]"]);
                    files["file[]"] = fileArr;
                }

                for (let file of files["file[]"]) {

                    let response = await uploadFile(file, fields, fileCount++);

                    if (response.status == false) {
                        filePaths.push({
                            "name": file.name,
                            "err": response.message,
                            "status": false
                        })
                    } else {
                        let url = response.data;
                        if (!validUrl.isUri(response.data)) {
                            url = req.protocol + "://" + req.headers.host + response.data;
                        }
                        filePaths.push({
                            "path": url,
                            "status": true
                        })
                    }
                }
                resolve(filePaths);
            });
        });

        return utils.successResponse(uploadFileRes,res);
       
    } catch (error) { 
        return utils.failureResponse(error.message,res);
    }
}

/**
 * 
 * Function used to create directory.
 * 
 * @param  {} dirPath
 */
const makeDirectory = async (directoryPath) => {

    if (!fs.existsSync(directoryPath)){
        fs.promises.mkdir(directoryPath, { recursive: true }, (err) => {
            if (err) {
                return false;
            };
            return true;
        });
    }
    return true;
}


/**
 * 
 * Function used to upload file
 * 
 * @param  {} files
 * @param  {} fields
 */
async function uploadFile(file, fields, fileCount) {

    let tempPath = file.path; 
    let unlink;

    let extension = path.extname(file.name);
    extension = extension.split('.').pop();

    fileType = file.type;

    if(allowedFileTypes.length){
        //Check allowed extension;
        if (!allowedFileTypes.includes(extension)) {
           return {
                status: false,
                message: "Not Allowed file."
            }
        }
    }

    // Check File Size
    const fileSize = ((file.size / 1024) / 1024);
    if (maxFileSize < fileSize) {
        return {
            status : false,
            message : `Allow file size upto ${maxFileSize} MB.`
        }
    }
    
    //Check Mime types of file.
    let isValidMimeType = await checkExtAndFileMimeType(file, extension);

    if (!isValidMimeType) {
        return {
            status: false,
            message: "File Invalid.",
        }
    }

    //Create New path
    let newPath = defaultDirectory + "/" + new Date().getTime() + path.extname(file.name);

    //Create Requested Directory,if given in request parameter.
    if (fields && fields.folder) {
        let newDir = defaultDirectory + "/" + fields.folder;
        const createDir = await makeDirectory(newDir);
        if(createDir){
            if (fields.fileName) {
                newPath = newDir + "/" + fields.fileName + "-" + fileCount + path.extname(file.name);
            }
        }
    }
    else if (fields && fields.fileName) {
        newPath = defaultDirectory + "/" + fields.fileName + "-" + fileCount + path.extname(file.name);
    }

    const response = await new Promise(async (resolve, reject) => {
        fs.readFile(tempPath, function (err, data) {
            fs.writeFile(newPath, data, async function (err) {

                //Remove file from temp
                unlink = await unlinkFile(tempPath);

                if (unlink.status == false) {
                    reject(unlink);
                } else {
                    resolve({
                        status: true,
                        message: "File upload successfully.",
                        data: "/" + newPath
                    });
                }
            });
        });
    });


    

    return response;
}

/**
 * 
 * Function used to unlink file.
 * 
 * @param  {} path
 */
async function unlinkFile(path) {

    fs.unlink(path, function (err) {
        if (err) {
            return {
                status: false,
                message: err.message
            }
        }
    });

    return {
        status: true
    };
}


/**
 * 
 * Function used to check mimetype with extension.
 * 
 * @param  {} path
 */
async function checkExtAndFileMimeType(file, extension) {
    return true;
 }




module.exports = {upload};