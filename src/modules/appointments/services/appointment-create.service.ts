import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppointmentCreateService {
  private readonly logger: Logger = new Logger(AppointmentCreateService.name);
}
