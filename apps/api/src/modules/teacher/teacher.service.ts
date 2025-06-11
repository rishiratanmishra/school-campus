import { BaseService } from '@api-base/base-classes/BaseService';
import { ITeacher, TeacherModel } from './teacher.model';
import { IUser, UserModel, UserRole } from '../user/user.model';
import { Ref } from '@typegoose/typegoose';

export class TeacherService extends BaseService<ITeacher> {
  constructor() {
    super(TeacherModel);
  }
  async create(teacherData: ITeacher): Promise<ITeacher> {
    const { name, email } = teacherData;

    const existingTeacher = await TeacherModel.findOne({ email });
    if (existingTeacher) {
      throw new Error('Teacher with this email already exists');
    }

    let existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      existingUser = await UserModel.create({
        name,
        email,
        password: 'teacher@123',
        role: UserRole.TEACHER,
        isActive: true,
      });
    }
    teacherData.userProfileId = existingUser._id as Ref<IUser>;
    const newTeacher = await TeacherModel.create(teacherData);
    return newTeacher;
  }
}
