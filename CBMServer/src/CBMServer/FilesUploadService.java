package CBMServer;

import org.restlet.resource.ServerResource;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.Put;
import org.restlet.Request;
import org.restlet.data.CharacterSet;
import org.restlet.data.MediaType;
import org.restlet.representation.Representation;
import org.restlet.resource.Delete;

public class FilesUploadService extends ServerResource {

	public FilesUploadService() {
		// Adjust some [maybe] missing request parameters
		Request request = Request.getCurrent();
        Representation rep = request.getEntity();
//        rep.setCharacterSet(CharacterSet.UTF_8);
//        rep.setMediaType(MediaType.APPLICATION_JSON);
//        request.setEntity(rep);
	}

	@Get("json")
	public String doGet() {
		return "Not ready yet... (Get)";
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
