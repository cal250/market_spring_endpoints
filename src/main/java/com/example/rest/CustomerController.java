package com.example.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173") // Additional CORS configuration
public class CustomerController {
    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);
    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<?> getAllCustomers() {
        try {
            logger.info("Fetching all customers");
            List<Customer> customers = customerService.getAllCustomers();
            return ResponseEntity.ok(customers);
        } catch (Exception e) {
            logger.error("Error fetching customers: ", e);
            return ResponseEntity.internalServerError()
                    .body("Error fetching customers: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        try {
            logger.info("Fetching customer with id: {}", id);
            return customerService.getCustomerById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching customer with id {}: ", id, e);
            return ResponseEntity.internalServerError()
                    .body("Error fetching customer: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        try {
            logger.info("Creating new customer: {}", customer.getName());
            Customer createdCustomer = customerService.createCustomer(customer);
            return ResponseEntity.ok(createdCustomer);
        } catch (Exception e) {
            logger.error("Error creating customer: ", e);
            return ResponseEntity.internalServerError()
                    .body("Error creating customer: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
        try {
            logger.info("Updating customer with id: {}", id);
            Customer updatedCustomer = customerService.updateCustomer(id, customerDetails);
            return ResponseEntity.ok(updatedCustomer);
        } catch (RuntimeException e) {
            logger.error("Error updating customer with id {}: ", id, e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating customer with id {}: ", id, e);
            return ResponseEntity.internalServerError()
                    .body("Error updating customer: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        try {
            logger.info("Deleting customer with id: {}", id);
            customerService.deleteCustomer(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting customer with id {}: ", id, e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting customer with id {}: ", id, e);
            return ResponseEntity.internalServerError()
                    .body("Error deleting customer: " + e.getMessage());
        }
    }
}
