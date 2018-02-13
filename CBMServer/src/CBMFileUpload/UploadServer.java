package CBMFileUpload;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.restlet.data.MediaType;
import org.restlet.data.Status;
import org.restlet.ext.fileupload.RestletFileUpload;
import org.restlet.representation.Representation;
import org.restlet.resource.Post;
import org.restlet.resource.ResourceException;
import org.restlet.resource.ServerResource;


public class UploadServer extends ServerResource {
	
	@Post
	public String handleUpload(Representation entity) throws Exception {
		String fName = null;
		if (entity != null 
	  	&& MediaType.MULTIPART_FORM_DATA.equals(entity.getMediaType(), true)) {
	    // Handle content
	    DiskFileItemFactory factory = new DiskFileItemFactory(); 
	    factory.setSizeThreshold(1024000); 
	      
	    RestletFileUpload upload = new RestletFileUpload(factory); 
	       
	    List<FileItem> items = upload.parseRepresentation(entity); 
	       
	    for(FileItem fi : items){ 
	 	   if (fi.getName() != null){
	 		    fName = "../../CBM_Files/" + fi.getName();
	            File file = new File(fName); 
	                fi.write(file); 
	     	   }
	        } 
	        setStatus(Status.SUCCESS_OK); 
	    }
	    return fName; //entity; 
    }
}
