import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppointmentUpdateService {
  private readonly logger: Logger = new Logger(AppointmentUpdateService.name);
}
