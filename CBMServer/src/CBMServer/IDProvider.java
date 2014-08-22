package CBMServer;

/**
 * CBM Identifier provider helper class
 */
public class IDProvider implements I_IDProvider
{
	@Override
	public String GetID() {
		// TODO switch to sequential ID 
		return java.util.UUID.randomUUID().toString(); 
	}

}
