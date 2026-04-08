package app.ecom.user.service;

import app.ecom.user.dto.AddressRequest;
import app.ecom.user.dto.AddressResponse;

import java.util.List;

public interface AddressService {

    List<AddressResponse> getAddresses(Long userId);

    AddressResponse addAddress(Long userId, AddressRequest request);

    AddressResponse setDefault(Long userId, Long addressId);

    void deleteAddress(Long userId, Long addressId);
}
