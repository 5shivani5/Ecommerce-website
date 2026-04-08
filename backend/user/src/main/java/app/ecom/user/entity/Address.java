package app.ecom.user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String addressLine;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String pincode;

    // Optional label e.g. "Home", "Office"
    private String label;

    // Whether this is the default address
    private boolean isDefault = false;

    public Address() {}

    public Address(Long userId, String addressLine, String city, String state, String pincode, String label, boolean isDefault) {
        this.userId = userId;
        this.addressLine = addressLine;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.label = label;
        this.isDefault = isDefault;
    }

    public Long getId()                        { return id; }
    public void setId(Long id)                 { this.id = id; }

    public Long getUserId()                    { return userId; }
    public void setUserId(Long userId)         { this.userId = userId; }

    public String getAddressLine()             { return addressLine; }
    public void setAddressLine(String v)       { this.addressLine = v; }

    public String getCity()                    { return city; }
    public void setCity(String v)              { this.city = v; }

    public String getState()                   { return state; }
    public void setState(String v)             { this.state = v; }

    public String getPincode()                 { return pincode; }
    public void setPincode(String v)           { this.pincode = v; }

    public String getLabel()                   { return label; }
    public void setLabel(String v)             { this.label = v; }

    public boolean isDefault()                 { return isDefault; }
    public void setDefault(boolean v)          { this.isDefault = v; }
}
