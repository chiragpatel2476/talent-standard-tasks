using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _tempFolder;
        private IAwsService _awsService;
        

        public FileService(IHostingEnvironment environment, 
            IAwsService awsService)
        {
            _environment = environment;
            _tempFolder = "images\\";
            _awsService = awsService;
            
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            //Your code here;
            // throw new NotImplementedException();
            // string filePath = Path.Combine(_environment.WebRootPath, _tempFolder);
            // 1) http://localhost:60290/images/id ==> this can be a logical path...
            //string filePath = Path.Combine(_environment.ContentRootPath, _tempFolder);
            //string fileURL = await Task.Run(() => {
            //    return Path.Combine(filePath, id);

            //});
            // config["hosturl"] - ??? if can be used instead of 'http://localhost:60290/'

            string fileURL = await Task.Run(() => {
                    return string.Join("/", "http://localhost:60290/images", id);
                });

            return fileURL;
        }

        // Actually Saves the supplied file to the preconfigured ('_tempFolder') folder
        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            //Your code here;
            // Get the path to the image upload folder

            // "H:\\industryconnect\\Internship\\Task 3\\Project\\Talent.Services.Profile\\wwwroot"
           // var uploads = Path.Combine(_environment.WebRootPath, _tempFolder);

            
            var uploads = Path.Combine(_environment.ContentRootPath, _tempFolder);
            var fileName = string.Empty;
            var newFileName = string.Empty;

            //Getting FileName
            // fileName = System.Net.Http.Headers.ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            fileName = file.FileName;

            //Assigning Unique Filename (Guid)
            var myUniqueFileName = Convert.ToString(Guid.NewGuid());

            //Getting file Extension
            var FileExtension = Path.GetExtension(fileName);

            // concating  FileName + FileExtension
            newFileName = myUniqueFileName + FileExtension;

            try
            { 
                if (file.Length > 0)
                {
                    //var fileName = fileSaveAsName == "" ? file.FileName : fileSaveAsName;
                    // Generate the full path (imagesave folder and image file name)
                    //var filePath = Path.Combine(uploads, file.FileName);
                    var filePath = Path.Combine(uploads, newFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        // Save the file
                        await file.CopyToAsync(fileStream);
                    }
                    
                }
                // return file.FileName;
                return newFileName;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
               // return null;
            }
            

        }

        public async Task<bool> DeleteFile(string id, FileType type)
        {
            //Your code here;
            // throw new NotImplementedException();
            var imagesFolderPath = Path.Combine(_environment.WebRootPath, _tempFolder);
            var filePath = Path.Combine(_tempFolder, id);

            try
            { 
                if (File.Exists(filePath))
                {
                    await Task.Run(() =>
                    {
                        File.Delete(filePath);
                        return true;
                    });
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
                //return false;
            }

        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}
