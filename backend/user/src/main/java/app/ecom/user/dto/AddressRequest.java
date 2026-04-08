package app.ecom.user.dto;

public class AddressRequest {

    private String addressLine;
    private String city;
    private String state;
    private String pincode;
    private String label;       // "Home", "Office", etc.
    private boolean isDefault;

    public AddressRequest() {}

    public String getAddressLine()        { return addressLine; }
    public void setAddressLine(String v)  { this.addressLine = v; }

    public String getCity()               { return city; }
    public void setCity(String v)         { this.city = v; }

    public String getState()              { return state; }
    public void setState(String v)        { this.state = v; }

    public String getPincode()            { return pincode; }
    public void setPincode(String v)      { this.pincode = v; }

    public String getLabel()              { return label; }
    public void setLabel(String v)        { this.label = v; }

    public boolean isDefault()            { return isDefault; }
    public void setDefault(boolean v)     { this.isDefault = v; }
}
