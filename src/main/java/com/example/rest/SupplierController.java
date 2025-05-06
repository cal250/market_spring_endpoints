package com.example.rest;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")  // Allow requests from any origin
public class SupplierController {

    private final SupplierService supplierService;

    @Autowired
    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    @GetMapping("/paged")
    public Page<Supplier> getSuppliersPaged(
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return supplierService.getSuppliersPage(pageable);
    }

    @PostMapping
    public ResponseEntity<String> createSupplier(@RequestBody Supplier supplier) {
        try {
            Supplier createdSupplier = supplierService.createSupplier(supplier);
            return ResponseEntity.ok("Supplier created successfully with ID: " + createdSupplier.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating supplier: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplier(@PathVariable Long id) {
        Supplier supplier = supplierService.getSupplier(id).orElse(null);
        if (supplier != null) {
            return ResponseEntity.ok(supplier);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplierDetails) {
        try {
            Supplier updatedSupplier = supplierService.updateSupplier(id, supplierDetails);
            return ResponseEntity.ok(updatedSupplier);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        try {
            supplierService.deleteSupplier(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}