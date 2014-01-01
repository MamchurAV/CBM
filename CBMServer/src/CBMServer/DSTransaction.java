package CBMServer;

import java.util.ArrayList;
import java.util.List;

public class DSTransaction 
{
	public int transactionNum;
	public List<DSRequest> operations = new ArrayList<DSRequest>(1);
}
