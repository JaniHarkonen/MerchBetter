export default class KeyManager {
    
        // Next unique key returned by the manager
    static nextKey = 222;

        // Returns a unique key
    static getKey() {
        return "" + (KeyManager.nextKey++);
    }
}