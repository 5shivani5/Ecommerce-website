package app.ecom.user.service.ServiceImpl;

import app.ecom.user.dto.AddressRequest;
import app.ecom.user.dto.AddressResponse;
import app.ecom.user.entity.Address;
import app.ecom.user.repository.AddressRepository;
import app.ecom.user.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public List<AddressResponse> getAddresses(Long userId) {
        return addressRepository.findByUserId(userId)
                .stream()
                .map(AddressResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public AddressResponse addAddress(Long userId, AddressRequest request) {
        // If this is being set as default, clear existing default first
        if (request.isDefault()) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(existing -> {
                        existing.setDefault(false);
                        addressRepository.save(existing);
                    });
        }

        // If user has no addresses yet, auto-set first one as default
        boolean noExisting = addressRepository.findByUserId(userId).isEmpty();

        Address address = new Address(
                userId,
                request.getAddressLine(),
                request.getCity(),
                request.getState(),
                request.getPincode(),
                request.getLabel() != null ? request.getLabel() : "",
                request.isDefault() || noExisting
        );

        return AddressResponse.from(addressRepository.save(address));
    }

    @Override
    public AddressResponse setDefault(Long userId, Long addressId) {
        // Clear old default
        addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(existing -> {
                    existing.setDefault(false);
                    addressRepository.save(existing);
                });

        // Set new default
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        address.setDefault(true);
        return AddressResponse.from(addressRepository.save(address));
    }

    @Override
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        addressRepository.delete(address);

        // If deleted address was default, make the first remaining one the default
        if (address.isDefault()) {
            List<Address> remaining = addressRepository.findByUserId(userId);
            if (!remaining.isEmpty()) {
                remaining.get(0).setDefault(true);
                addressRepository.save(remaining.get(0));
            }
        }
    }
}
