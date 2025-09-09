import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppointmentDeleteService {
  private readonly logger: Logger = new Logger(AppointmentDeleteService.name);
}
