import { BaseController } from "@api-base/base-classes/BaseController";
import { ITeacher } from "./teacher.model";
import { TeacherService } from "./teacher.service";


export class TeacherController extends BaseController<ITeacher>{
    constructor() {
        super(new TeacherService());
    }
}