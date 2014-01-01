/**
 * 
 */
package CBMServer;

/**
 * @author Alexander Mamchur
 * Returns <pool> number of <long> identifiers
 */
public interface I_IDProvider 
{
	public long GetID(int pool);
}
