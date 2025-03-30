import IEmailService from "api/interfaces/IEmailService";
import RealEstateListing from "domain/entities/RealEstateListing";
import { Resend } from "resend";

class ResendEmailService implements IEmailService {
    private readonly resend: Resend = null!;

    constructor(apiKey?: string) {
        if (apiKey != null) {
            this.resend = new Resend(apiKey);
        }
    }

    sendRealEstateListingInquiryEmail(params: { inquiry: string; listing: RealEstateListing; email: string }): void {
        this.resend.emails.send({
            from: params.email,
            to: "angular-real-estate@protonmail.com",
            subject: `${params.listing.title}`,
            html: params.inquiry,
        });
    }
}

export default ResendEmailService;
