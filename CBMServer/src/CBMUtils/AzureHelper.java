package CBMUtils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.EnumSet;
import java.util.List;

import org.restlet.Request;
import org.restlet.data.Method;

import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.blob.CloudBlobClient;
import com.microsoft.azure.storage.blob.CloudBlobContainer;
import com.microsoft.azure.storage.blob.CloudBlockBlob;
import com.microsoft.azure.storage.blob.SharedAccessBlobPermissions;
import com.microsoft.azure.storage.blob.SharedAccessBlobPolicy;

//import com.microsoft.azure.storage.*;
//import com.microsoft.azure.storage.blob.*;

public class AzureHelper {
	
	// Retrieve storage account from connection-string.
    //	String storageConnectionString =
    //	    RoleEnvironment.getConfigurationSettings().get("StorageConnectionString");
//	private static final String STORAGE_ACCOUNT_NAME = "INSERT_AZURE_STORAGE_ACCOUNT_NAME_HERE";
//    private static final String STORAGE_ACCOUNT_KEY = "INSERT_AZURE_STORAGE_ACCOUNT_KEY_HERE";
////    private static final List<String> ALLOWED_CORS_ORIGINS = new ArrayList<String>() {"INSERT_WEB_APPLICATION_URL_HERE"};
////    private static final List<String> ALLOWED_CORS_HEADERS = new ArrayList<String>() {"x-ms-meta-qqfilename", "Content-Type", "x-ms-blob-type", "x-ms-blob-content-type"};
////    private static final CorsHttpMethods ALLOWED_CORS_METHODS = CorsHttpMethods.DELETE  CorsHttpMethods.PUT;
////    private static final int ALLOWED_CORS_AGE_DAYS = 5;
//    private static final String SIGNATURE_SERVER_ENDPOINT_ADDRESS = "http://*:8080/sas/";
//    private static final String UPLOAD_SUCCESS_ENDPOINT_ADDRESS = "http://*:8080/success/";


	

	public static String GetSAS(String blobUri, String verb){
		
		String result = null;
		String storageConnectionString =
			    "DefaultEndpointsProtocol=http;" +
			    "AccountName=aydadev;" +
			    "AccountKey=iRmsOs9YV+WbC0Rf3T8zUvzqaMJGl9SPcllg/bcPTYNy93Vv5GkKGqYrcOaoHu9yYKsM8NdcgqjQAxsbh0VtRA==";
		
//		// TODO parse request here to extract separate parameters
//        String blobUri = (String) request.getAttributes().get("bloburi");
//        String verb = request.getMethod().toString();
    	
    	try {
    	    // Retrieve storage account from connection-string.
    	    CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);

    	    // Create the blob client.
    	    CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

    	    // Retrieve reference to a previously created container.
    	    CloudBlobContainer container = blobClient.getContainerReference("mycontainer");

//    	    // Define the path to a local file.
//    	    final String filePath = "C:\\myimages\\myimage.jpg";

    	    // Create or overwrite the "myimage.jpg" blob with contents from a local file.
    	    CloudBlockBlob blob = container.getBlockBlobReference("fileName");

    	    EnumSet<SharedAccessBlobPermissions> permissions =  EnumSet.of(SharedAccessBlobPermissions.WRITE);
    	    
    	    SharedAccessBlobPolicy policy = new SharedAccessBlobPolicy();
    	    policy.setPermissions(permissions);
    	    Calendar now = Calendar.getInstance();
    	    now.add(Calendar.MINUTE, 15);
    	    Date dateFromNow = now.getTime();
    	    policy.setSharedAccessExpiryTime(dateFromNow);
    	    
            String sas = blob.generateSharedAccessSignature(policy, null);
            result = blob.getUri() +"?"+ sas;

//            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(sas);
//            response.ContentLength64 = buffer.Length;
//            System.IO.Stream output = response.OutputStream;
//            output.Write(buffer, 0, buffer.Length);
//            output.Close();
  		
     	} catch (Exception e) {
    	    // Output the stack trace.
    	    e.printStackTrace();
    	} 
    	
		return result;  	
	}
	
}
