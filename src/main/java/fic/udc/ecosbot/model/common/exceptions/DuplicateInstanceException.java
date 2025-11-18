package fic.udc.ecosbot.model.common.exceptions;
/**
 * The Class DuplicateInstanceException.
 */
@SuppressWarnings("serial")
public class DuplicateInstanceException extends Exception {

    /**
     * Instantiates a new duplicate instance exception.
     *
     * @param name the name
     * @param key the key
     */
    public DuplicateInstanceException(String name, Object key) {
    	super(name + " with key " + key + " already exists."); 	
    }
    
}
