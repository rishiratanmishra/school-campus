import { BaseController } from "@api-base/base-classes/BaseController";
import { IStudent } from "./student.model";
import { StudentService } from "./student.service";



export class StudentController extends BaseController<IStudent> {
  constructor() {
    super(new StudentService());
    }
   
}