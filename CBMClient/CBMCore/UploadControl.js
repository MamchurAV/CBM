// ===================== Files Uploading block ===========================

isc.ClassFactory.defineClass("ImageCropedUploadControl", isc.CanvasItem);
isc.ImageCropedUploadControl.addProperties({
  shouldSaveValue: false, 
 
  
  createCanvas: function (formParent) {
		  var canv = isc.HLayout.create({
          border: "1px solid blue",
          height: 40,
	      members: [
					isc.Img.create({
							ID: "thumbnailImg",
							border: "1px solid blue",
							width: 120, height: 80,
//							imageType: "stretch",
							//imageWidth: 119, 
							imageHeight: 79,
							imageType: "center",
							click: function(event){ 
								ImageProcessWindow.caller = this.parentElement;
								ImageProcessWindow.show();
								ImageProcessWindow.setImage();
							}
					}),
								
				isc.VLayout.create({ 
				members: [
					isc.DynamicForm.create({
						autoDraw: false,
						ID: "uploadForm", width: 80,
						fields: [
							{ type: "imageFile", canEdit: true, downloadIconSrc: "new.png",
								changed: function(form, item){
									if (item.uploadItem._dataElement.files && item.uploadItem._dataElement.files[0]) {
										var reader = new FileReader();
										reader.onload = function(e) {
											//if (fileName.endsWith("jpg")) {
												thumbnailImg.setSrc( e.target.result );
											//}
										}
										var uploadControl = this.editForm.parentElement.parentElement.parentElement.canvasItem;
										// Mark control as changed
										uploadControl.setProperty("choiceDone", true);
										
										reader.readAsDataURL(item.uploadItem._dataElement.files[0]);

										uploadControl.fileToUpload = item.uploadItem._dataElement.files[0];
										
									  }
								} 
							}
						]
					}),
					
					isc.Button.create({
							title: "Ready!",
							click: function(event){ 
								var uploaderControl = this.parentElement.parentElement.canvasItem;
								if (uploaderControl.blobToUpload){
									//uploaderControl.fileUploader.addBlobs(uploaderControl.blobToUpload);
									uploaderControl.fileUploader.addFiles(uploaderControl.blobToUpload);
								} else if (uploaderControl.fileToUpload) {
									uploaderControl.fileUploader.addFiles(uploaderControl.fileToUpload);
								}
								uploaderControl.fileUploader.uploadStoredFiles();
							}
					})
				]})
		  ], 
				                
				getFile: function(){
					return this.members[0].src;
					//return this.canvasItem.fileToUpload;
				},
				
				setBlob: function(blob) {
					if(typeof blob === "string"){
						thumbnailImg.setSrc(blob);
					} else {
						thumbnailImg.parentElement.canvasItem.blobToUpload = blob; 
					}
				}

    });
    
    this.fileUploader = new qq.azure.FineUploaderBasic({
                autoUpload: false,
                request: {
                    endpoint: AZURE_BLOB_URL
                },
                signature: {
                    endpoint: '/UploadAzureBlob' // < Method of CBM server to obtain Azure SAS 
                },
                retry: {
                    enableAuto: true
                },
                validation: {
                    itemLimit: 1,
                    sizeLimit: 16384000000 // 16Gb
                },
                multiple: false,
                chunking: {
                    partSize: 50000000, // 50Mb
                    minFileSize: 204800001 // 200Mb
                },
                deleteFile: {
                  // TODO: Investigate why /DeleteAzureBlob not routed by FineUploader 
                  //      - request goes as GET and to /UploadAzureBlob  :-(
                  enabled: true,
                  forceConfirm: true,
                  endpoint: '/DeleteAzureBlob'
                },
                sesion: {
                  endpoint: null
                },
                callbacks: {
                    onComplete: function(id, name, responseJSON, xhr) {
                      var newName = xhr.responseURL.substring(0, xhr.responseURL.indexOf("?"));
                      //this.iscContext.canvasItem.storeValue(newName);
                      this.canvas.canvasItem.storeValue(newName); //<<<<<<<<<<<<<<<<<<<<<?????
                    },
                    onDeleteComplete: function(id, name, responseJSON, xhr) {
                      this.canvas.canvasItem.storeValue(null);
                    },
                    onSubmit: function(fileId, fileName) {
                      return true;
                    },
                    onPasteReceived: function(blob) {
                      return true;
                    },
                    onValidate: function(fileInfo, buttonContainer) {
                      return true;
                    }
                }
            });

	return canv;
  } //,
  
	//~ getValue: function(){
		//~ this.Super("getValue", arguments);
		//~ if (this.canvas.canvasItem.choiceDone) {
			//~ // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< FineUploader
			//~ this.fileUploader.addFiles(this.fileToUpload);
			
            //~ this.fileUploader.uploadStoredFiles();
        //~ }
	//~ }, 
	
});
// <<< End Azure-Upload control


// =============================================================================

/*
// ------------------------ File direct upload control  ----------------------------
// TODO Provide upload to CBM server. Till now it's copy of Azure upload control
isc.defineClass("UploadCanvas", "Canvas");
isc.UploadCanvas.addProperties({
  
    getInnerHTML : function () {
                      var divHtml = "<div id=uploader_" + this.ID + ">Upload file!!!</div>";
                      return divHtml;
                    },

    draw : function () {
            if (!this.readyToDraw()) return this;
            this.Super("draw", arguments);
            
            this.el = document.getElementById("uploader_" + this.ID);
            this.azureUploader = new qq.azure.FineUploader({
                element: this.el,
                request: {
                    endpoint: AZURE_BLOB_URL
                },
                signature: {
                    endpoint: '/Upload'
                },
                retry: {
                    enableAuto: true
                },
                validation: {
                    itemLimit: 1,
                    sizeLimit: 16384000000 // 16Gb
                },
                multiple: false,
                chunking: {
                    partSize: 50000000, // 50Mb
                    minFileSize: 204800001 // 200Mb
                },
                callbacks: {
                    onComplete: function(id, name, responseJSON, xhr) {
                      var newName = xhr.responseURL.substring(0, xhr.responseURL.indexOf("?"));
                      this.iscContext.canvasItem.storeValue(newName);
                    }
                  }
            });
            // Some artificial context establishing for callbacks (so that it seems buggy in usual resolving techniques) 
            this.azureUploader.iscContext = this;
             
            return this;
       },
       
    redrawOnResize: false 
}); 

isc.ClassFactory.defineClass("UploadControl", isc.CanvasItem);
isc.UploadControl.addProperties({
  shouldSaveValue: true, 
  createCanvas: function (formParent) {
                  var canv = isc.UploadCanvas.create(); 
                  return canv;
                }
});
*/

// ------------------------ Azure direct upload control  ----------------------------
isc.defineClass("AzureUploadCanvas", "Canvas");
isc.AzureUploadCanvas.addProperties({
  
    getInnerHTML : function () {
                      var divHtml = "<div id=uploader_" + this.ID + ">Upload file!!!</div>";
                      return divHtml;
                    },

    draw : function () {
            if (!this.readyToDraw()) return this;
            this.Super("draw", arguments);
            
            this.div = document.getElementById("uploader_" + this.ID);
            this.azureUploader = new qq.azure.FineUploader({
                element: this.div,
                autoUpload: false,
                request: {
                    endpoint: AZURE_BLOB_URL
                },
                signature: {
                    endpoint: '/UploadAzureBlob' // < Method of CBM server to obtain Azure SAS 
                },
                retry: {
                    enableAuto: true
                },
                validation: {
                    itemLimit: 1,
                    sizeLimit: 16384000000 // 16Gb
                },
                multiple: false,
                chunking: {
                    partSize: 50000000, // 50Mb
                    minFileSize: 204800001 // 200Mb
                },
                deleteFile: {
                  // TODO: Investigate why /DeleteAzureBlob not routed by FineUploader 
                  //      - request goes as GET and to /UploadAzureBlob  :-(
                  enabled: true,
                  forceConfirm: true,
                  endpoint: '/DeleteAzureBlob'
                },
                sesion: {
                  endpoint: null
                },
                callbacks: {
                    onComplete: function(id, name, responseJSON, xhr) {
                      var newName = xhr.responseURL.substring(0, xhr.responseURL.indexOf("?"));
                      this.iscContext.canvasItem.storeValue(newName);
                    },
                    onDeleteComplete: function(id, name, responseJSON, xhr) {
                      this.iscContext.canvasItem.storeValue(null);
                    },
                    onSubmit: function(fileId, fileName) {
                      return true;
                    },
                    onPasteReceived: function(blob) {
                      return true;
                    },
                    onValidate: function(fileInfo, buttonContainer) {
                      return true;
                    }
                }
            });
            // Some CBM-specific context establishing for callbacks (so that it seems buggy in usual resolving techniques) 
            this.azureUploader.iscContext = this;
            
            // Erlier uploaded files presentation
            var name = this.canvasItem.getValue();
            if (name) {
              var blobName = name.slice(name.lastIndexOf("/") + 1);
              var UUID = blobName.slice(0, blobName.lastIndexOf("."));
              this.azureUploader.addInitialFiles([{"name": name, 
                                                   "UUID": UUID, 
                                                   "blobName": blobName, 
                                                   "thumbnailUrl": name, 
                                                   "deleteFileEndpoint": "/DeleteAzureBlob"}]);
            }
             
            return this;
       },
       
    redrawOnResize: false 
}); 

isc.ClassFactory.defineClass("AzureUploadControl", isc.CanvasItem);
isc.AzureUploadControl.addProperties({
  shouldSaveValue: true, 
  createCanvas: function (formParent) {
                  var canv = isc.AzureUploadCanvas.create(); 
                  return canv;
                }
});





