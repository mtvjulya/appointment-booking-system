package ie.gov.appointments.config;

import ie.gov.appointments.entity.*;
import ie.gov.appointments.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final GovServiceRepository serviceRepository;
    private final ServiceCentreRepository centreRepository;

    public DataSeeder(UserRepository userRepository,
                      GovServiceRepository serviceRepository,
                      ServiceCentreRepository centreRepository) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.centreRepository = centreRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // Users
        User user = new User();
        user.setFirstName("Conor");
        user.setLastName("O'Brien");
        user.setEmail("conor@obrien.com");
        user.setPasswordHash("password123");
        user.setPhone("+353851234567");
        user.setRole("USER");
        userRepository.save(user);

        User admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail("admin@gov.ie");
        admin.setPasswordHash("admin123");
        admin.setPhone("+353861234567");
        admin.setRole("ADMIN");
        userRepository.save(admin);

        // === NDLS ===
        GovService ndls = new GovService();
        ndls.setServiceName("NDLS - Driving Licence");
        ndls.setDescription("Apply for or renew your driving licence or learner permit at an NDLS centre.");
        ndls.setCategory("Transport");
        ndls.setEstimatedDuration(15);
        ndls.setTermsUrl("Terms and conditions\n\nThis legal notice applies to the entire contents of this booking facility. Please take some time to read these Terms and Conditions of Use ('Terms of Use') as by using this booking facility you indicate your acceptance of these Terms of Use regardless of whether or not you choose to register with us. If you do not accept these terms, do not use this booking facility. By using any part of the booking engine, you shall be deemed to have accepted this legal notice in full.");
        serviceRepository.save(ndls);

        ServiceCentre ndlsDublin = createCentre("NDLS Dublin", "King's Inns House, Parnell St, Dublin 1", "D01 A3Y8", ndls);
        ServiceCentre ndlsCork = createCentre("NDLS Cork", "Penrose Wharf, Penrose Quay, Cork", "T23 KW60", ndls);
        ServiceCentre ndlsCarlow = createCentre("NDLS Carlow", "Unit 1, Shamrock Business Park, Graiguecullen, Carlow", "R93 X5K7", ndls);

        // === Passport ===
        GovService passport = new GovService();
        passport.setServiceName("Passport Application");
        passport.setDescription("Apply for a new Irish passport or renew an existing one.");
        passport.setCategory("Identity");
        passport.setEstimatedDuration(30);
        passport.setTermsUrl("Terms and conditions\n\nThis legal notice applies to the entire contents of this booking facility. Please take some time to read these Terms and Conditions of Use ('Terms of Use') as by using this booking facility you indicate your acceptance of these Terms of Use regardless of whether or not you choose to register with us. If you do not accept these terms, do not use this booking facility. By using any part of the booking engine, you shall be deemed to have accepted this legal notice in full.");
        serviceRepository.save(passport);

        ServiceCentre passportDublin = createCentre("Passport Office Dublin", "Knockmaun House, Mount St Lower, Dublin 2", "D02 TN83", passport);
        ServiceCentre passportCork = createCentre("Passport Office Cork", "1A South Mall, Cork", "T12 CCN3", passport);

        // === Social Welfare ===
        GovService socialWelfare = new GovService();
        socialWelfare.setServiceName("Social Welfare Appointment");
        socialWelfare.setDescription("Meet with a case officer regarding your social welfare payments or benefits.");
        socialWelfare.setCategory("Social Protection");
        socialWelfare.setEstimatedDuration(45);
        socialWelfare.setTermsUrl("Terms and conditions\n\nThis legal notice applies to the entire contents of this booking facility. Please take some time to read these Terms and Conditions of Use ('Terms of Use') as by using this booking facility you indicate your acceptance of these Terms of Use regardless of whether or not you choose to register with us. If you do not accept these terms, do not use this booking facility. By using any part of the booking engine, you shall be deemed to have accepted this legal notice in full.");
        serviceRepository.save(socialWelfare);

        ServiceCentre intreoDublin = createCentre("Intreo Centre Dublin", "Bishops Square, Redmond's Hill, Dublin 2", "D02 TD99", socialWelfare);
        ServiceCentre intreoGalway = createCentre("Intreo Centre Galway", "Augustine St, Galway", "H91 K2TY", socialWelfare);

        // === Immigration ===
        GovService immigration = new GovService();
        immigration.setServiceName("Immigration Registration (IRP)");
        immigration.setDescription("Register or renew your Irish Residence Permit (IRP card).");
        immigration.setCategory("Immigration");
        immigration.setEstimatedDuration(30);
        immigration.setTermsUrl("Terms and conditions\n\nThis legal notice applies to the entire contents of this booking facility. Please take some time to read these Terms and Conditions of Use ('Terms of Use') as by using this booking facility you indicate your acceptance of these Terms of Use regardless of whether or not you choose to register with us. If you do not accept these terms, do not use this booking facility. By using any part of the booking engine, you shall be deemed to have accepted this legal notice in full.");
        serviceRepository.save(immigration);

        ServiceCentre irpDublin = createCentre("Burgh Quay Registration Office", "13-14 Burgh Quay, Dublin 2", "D02 XK70", immigration);

        // === Revenue ===
        GovService revenue = new GovService();
        revenue.setServiceName("Revenue - Tax Consultation");
        revenue.setDescription("Book a consultation with Revenue regarding your tax affairs.");
        revenue.setCategory("Tax & Revenue");
        revenue.setEstimatedDuration(40);
        revenue.setTermsUrl("Terms and conditions\n\nThis legal notice applies to the entire contents of this booking facility. Please take some time to read these Terms and Conditions of Use ('Terms of Use') as by using this booking facility you indicate your acceptance of these Terms of Use regardless of whether or not you choose to register with us. If you do not accept these terms, do not use this booking facility. By using any part of the booking engine, you shall be deemed to have accepted this legal notice in full.");
        serviceRepository.save(revenue);

        ServiceCentre revenueDublin = createCentre("Revenue Dublin", "Central Revenue Building, O'Connell St, Dublin 1", "D01 W6X0", revenue);
        ServiceCentre revenueLimerick = createCentre("Revenue Limerick", "River House, Charlotte Quay, Limerick", "V94 R972", revenue);

       

        System.out.println("=== Data seeded: 2 users, 5 services, 10 centres ===");
        System.out.println("=== NOTE: Create time slots through admin panel at /admin/create-slots ===");
    }

    private ServiceCentre createCentre(String name, String address, String eircode, GovService service) {
        ServiceCentre centre = new ServiceCentre();
        centre.setCentreName(name);
        centre.setAddress(address);
        centre.setEircode(eircode);
        centre.setService(service);
        return centreRepository.save(centre);
    }
}