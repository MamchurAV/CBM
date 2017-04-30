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

public class FilesUploadService extends ServerResource {
	private Request request;
	
	public FilesUploadService() {
		request = Request.getCurrent();
	}

	@Get("json")
	public String doGet() {
		// TODO parse request here to extract separate parameters
        String blobUri = (String) request.getAttributes().get("bloburi");
        String verb = request.getMethod().toString();

		return AzureHelper.GetSAS(blobUri, verb);
	}
	
	@Post("json")
	public String doPost() {
		return "Not ready yet... (Post)";
	}
	
	@Put("json")
	public String doPut() {
		return "Not ready yet... (Put)";
	}

	@Delete("json")
	public String doDelete() {
		return "Not ready yet... (Delete)";
	}
	
}
