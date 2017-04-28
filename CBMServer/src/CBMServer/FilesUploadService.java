package CBMServer;

import org.restlet.resource.ServerResource;

import CBMUtils.AzureHelper;

import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.Put;
import org.restlet.Request;
import org.restlet.resource.Delete;

public class FilesUploadService extends ServerResource {
	private Request request;
	
	public FilesUploadService() {
		request = Request.getCurrent();
	}

	@Get("json")
	public String doGet() {
		return AzureHelper.GetSAS(request);
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
