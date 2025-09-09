import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppointmentFindByIdService {
  private readonly logger: Logger = new Logger(AppointmentFindByIdService.name);
}
