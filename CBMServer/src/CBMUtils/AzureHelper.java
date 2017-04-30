package CBMUtils;

import java.util.Calendar;
import java.util.Date;
import java.util.EnumSet;
import java.util.TimeZone;

import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.blob.CloudBlobClient;
import com.microsoft.azure.storage.blob.CloudBlobContainer;
import com.microsoft.azure.storage.blob.CloudBlockBlob;
import com.microsoft.azure.storage.blob.SharedAccessBlobPermissions;
import com.microsoft.azure.storage.blob.SharedAccessBlobPolicy;

import CBMServer.CBMStart;

public class AzureHelper {
	
	private static final String storageConnectionString =
		    "DefaultEndpointsProtocol=http;"
		    + "AccountName=" + CBMStart.getParam("AzureAccountName")
		    + "AccountKey=" + CBMStart.getParam("AzureAccountKey");
	
	public static String GetSAS(String blobUri, String mehod){

		String result = null;
		
    	try {
    	    // Retrieve storage account from connection-string.
    	    CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);

    	    // Create the blob client.
    	    CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

    	    // Retrieve reference to container.
    	    CloudBlobContainer container = blobClient.getContainerReference(CBMStart.getParam("AzureContainer"));
    	    
    	    // Retrieve Blob handle.
    	    String fileName = blobUri.substring(blobUri.lastIndexOf("//") + 2);
    	    CloudBlockBlob blob = container.getBlockBlobReference(fileName);
    	    
    	    // Prepare Policy for SAS obtaining
    	    SharedAccessBlobPolicy policy = new SharedAccessBlobPolicy();
    	      EnumSet<SharedAccessBlobPermissions> permissions =  EnumSet.of(SharedAccessBlobPermissions.WRITE);
    	    policy.setPermissions(permissions);
    	      TimeZone timeZone = TimeZone.getTimeZone("UTC");
    	      Calendar now = Calendar.getInstance(timeZone);
    	      now.add(Calendar.MINUTE, 15);
    	      Date dateFromNow = now.getTime();
    	    policy.setSharedAccessExpiryTime(dateFromNow);

    	    // Just get SAS
            String sas = blob.generateSharedAccessSignature(policy, null);
            
            result = blob.getUri() + "?" + sas;
            
     	} catch (Exception e) {
    	    // Output the stack trace.
    	    e.printStackTrace();
    	} 
    	
		return result;  	
	}
	
}
