import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  Logger,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { GenerateOtpDto, VerifyOtpDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async generateOtp(
    @Res() res: Response,
    @Body() generateOtpDto: GenerateOtpDto
  ): Promise<void> {
    try {
      await this.authService.generateOtp(generateOtpDto)
      res.status(HttpStatus.OK).json({ message: 'OTP sent' })
    } catch (error: any) {
      Logger.error(error)
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message })
    }
  }

  @Post('verify')
  async verifyOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() verifyOtpDto: VerifyOtpDto
  ): Promise<void> {
    try {
      const user = await this.authService.verifyOtp(verifyOtpDto)
      if (user) {
        Object.assign(req.session, { user })
        Logger.log(`Successfully verified OTP for user ${verifyOtpDto.email}`)
        res.status(HttpStatus.OK).json({ message: 'OTP verified' })
      } else {
        Logger.warn(`Incorrect OTP given for ${verifyOtpDto.email}`)
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Incorrect OTP given' })
      }
    } catch (error: any) {
      Logger.error(error)
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message })
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    req.session.destroy(() =>
      res.status(HttpStatus.OK).json({ message: 'Logged out' })
    )
  }

  @Get('whoami')
  async whoami(@Req() req: Request, @Res() res: Response): Promise<void> {
    res.status(HttpStatus.OK).json(req.session.user || null)
  }
}
