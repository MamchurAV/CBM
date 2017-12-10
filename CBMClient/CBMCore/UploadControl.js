// ===================== Files Uploading block ===========================

isc.ClassFactory.defineClass("AzureUploadControl", isc.CanvasItem);
isc.AzureUploadControl.addProperties({
  shouldSaveValue: true, 
 
  
  createCanvas: function (formParent) {
		  var canv = isc.HLayout.create({
          border: "1px solid blue",
          height: 40,
	      members: [
					isc.Img.create({
							ID: "thumbnailImg",
							border: "1px solid blue",
							width: 120, height: 80,
							imageType: "stretch",
							click: function(event){ 
								ImageProcessWindow.caller = this.parentElement;
								ImageProcessWindow.show();
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
											thumbnailImg.setSrc( e.target.result );
										}
										// Mark control as changed
										this.editForm.parentElement.parentElement.parentElement.canvasItem.setProperty("choiceDone", true);
										
										reader.readAsDataURL(item.uploadItem._dataElement.files[0]);
									  }
								} 
							}
						]
					})
				]})
		  ], 
				                
				getFile: function(){
					return this.members[0].src;
				},
				
				addFiles: function(file) {
					thumbnailImg.setSrc(file);
					// Mark control as changed
					this.canvasItem.choiceDone = true;
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
  },
  
	getValue: function(){
		this.Super("getValue", arguments);
		if (this.canvas.canvasItem.choiceDone) {
			// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< FineUploader
            this.fileUploader.uploadStoredFiles();
        }
	}, 
	

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
isc.defineClass("AzureUploadCanvas_0", "Canvas");
isc.AzureUploadCanvas_0.addProperties({
  
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

isc.ClassFactory.defineClass("AzureUploadControl_0", isc.CanvasItem);
isc.AzureUploadControl_0.addProperties({
  shouldSaveValue: true, 
  createCanvas: function (formParent) {
                  var canv = isc.AzureUploadCanvas_0.create(); 
                  return canv;
                }
});





