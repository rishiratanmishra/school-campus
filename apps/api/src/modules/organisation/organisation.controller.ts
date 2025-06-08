import { BaseController } from "@api-base/base-classes/BaseController";
import { OrganisationService } from "./organisation.service";
import { IOrganisation } from "./organisation.model";

export class OrganisationController extends BaseController<IOrganisation> {
    constructor() {
        super(new OrganisationService());
    }
}
