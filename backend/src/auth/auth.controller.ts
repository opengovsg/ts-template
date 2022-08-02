import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'

import { AuthService } from './auth.service'
import { GenerateOtpDto, VerifyOtpDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectPinoLogger(AuthController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  async generateOtp(
    @Res() res: Response,
    @Body() generateOtpDto: GenerateOtpDto,
  ): Promise<void> {
    try {
      await this.authService.generateOtp(generateOtpDto)
      res.status(HttpStatus.OK).json({ message: 'OTP sent' })
    } catch (error: any) {
      this.logger.error(error)
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message })
    }
  }

  @Post('verify')
  async verifyOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<void> {
    try {
      const user = await this.authService.verifyOtp(verifyOtpDto)
      if (user) {
        Object.assign(req.session, { user })
        this.logger.info(
          `Successfully verified OTP for user ${verifyOtpDto.email}`,
        )
        res.status(HttpStatus.OK).json({ message: 'OTP verified' })
      } else {
        this.logger.warn(`Incorrect OTP given for ${verifyOtpDto.email}`)
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Incorrect OTP given' })
      }
    } catch (error: any) {
      this.logger.error(error)
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message })
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    req.session.destroy(() =>
      res.status(HttpStatus.OK).json({ message: 'Logged out' }),
    )
  }

  @Get('whoami')
  async whoami(@Req() req: Request, @Res() res: Response): Promise<void> {
    res.status(HttpStatus.OK).json(req.session.user || null)
  }
}
