import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const reservation = this.reservationRepository.create(createReservationDto);
    return await this.reservationRepository.save(reservation);
  }

  async findAll() {
    return await this.reservationRepository.find({ relations: ['user', 'storeProduct'] });
  }

  async findOne(id: number) {
    const reservation = await this.reservationRepository.findOne({ where: { id }, relations: ['user', 'storeProduct'] });
    if (!reservation) throw new NotFoundException(`Reservation #${id} not found`);
    return reservation;
  }

  async cancel(id: number) {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
    return { message: 'Reservation cancelled successfully' };
  }
}
