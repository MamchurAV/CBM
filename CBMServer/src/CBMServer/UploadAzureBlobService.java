package CBMServer;

import org.restlet.resource.ServerResource;

import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.blob.CloudBlobClient;
import com.microsoft.azure.storage.blob.CloudBlobContainer;
import com.microsoft.azure.storage.blob.CloudBlockBlob;
import com.microsoft.azure.storage.blob.SharedAccessBlobPermissions;
import com.microsoft.azure.storage.blob.SharedAccessBlobPolicy;

import CBMUtils.AzureHelper;

import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.Put;

import java.util.Calendar;
import java.util.Date;
import java.util.EnumSet;

import org.restlet.Request;
import org.restlet.resource.Delete;

public class UploadAzureBlobService extends ServerResource {
	private Request request;
	
	public UploadAzureBlobService() {
		request = Request.getCurrent();
	}

	@Get("json")
	public String doGet() {
        String blobUri = getQueryValue("bloburi");
        
     // TODO: Investigate why deletion not called by client (FineUploader) and normally remove deletion logic here
        String deletionConfirmation = getQueryValue("_method");
        
        if (deletionConfirmation == null || !deletionConfirmation.equals("DELETE")){
    		// Azure storage used:
    		return AzureHelper.GetSAS(blobUri);
        }
        else {
			// Azure storage used:
			return AzureHelper.DeleteBlob(blobUri);
        }
       
	}
}
