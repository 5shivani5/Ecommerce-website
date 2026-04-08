package app.ecom.user.dto;

import app.ecom.user.entity.Address;

public class AddressResponse {

    private Long    id;
    private Long    userId;
    private String  addressLine;
    private String  city;
    private String  state;
    private String  pincode;
    private String  label;
    private boolean isDefault;

    public static AddressResponse from(Address a) {
        AddressResponse r = new AddressResponse();
        r.id          = a.getId();
        r.userId      = a.getUserId();
        r.addressLine = a.getAddressLine();
        r.city        = a.getCity();
        r.state       = a.getState();
        r.pincode     = a.getPincode();
        r.label       = a.getLabel();
        r.isDefault   = a.isDefault();
        return r;
    }

    public Long    getId()                     { return id; }
    public Long    getUserId()                 { return userId; }
    public String  getAddressLine()            { return addressLine; }
    public String  getCity()                   { return city; }
    public String  getState()                  { return state; }
    public String  getPincode()                { return pincode; }
    public String  getLabel()                  { return label; }
    public boolean isDefault()                 { return isDefault; }
}
