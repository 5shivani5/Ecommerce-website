package app.ecom.user.controller;

import app.ecom.user.dto.AddressRequest;
import app.ecom.user.dto.AddressResponse;
import app.ecom.user.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AddressController {

    @Autowired
    private AddressService addressService;

    // GET /api/address/{userId}  - get all saved addresses for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<AddressResponse>> getAddresses(@PathVariable Long userId) {
        return ResponseEntity.ok(addressService.getAddresses(userId));
    }

    // POST /api/address/{userId}  - add a new address
    @PostMapping("/{userId}")
    public ResponseEntity<AddressResponse> addAddress(
            @PathVariable Long userId,
            @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.addAddress(userId, request));
    }

    // PUT /api/address/{userId}/{addressId}/default  - set as default
    @PutMapping("/{userId}/{addressId}/default")
    public ResponseEntity<AddressResponse> setDefault(
            @PathVariable Long userId,
            @PathVariable Long addressId) {
        return ResponseEntity.ok(addressService.setDefault(userId, addressId));
    }

    // DELETE /api/address/{userId}/{addressId}  - delete an address
    @DeleteMapping("/{userId}/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId) {
        addressService.deleteAddress(userId, addressId);
        return ResponseEntity.noContent().build();
    }
}
