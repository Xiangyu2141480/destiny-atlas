declare module 'lunar-javascript' {
  interface EightChar {
    getYear(): string; getMonth(): string; getDay(): string; getTime(): string
    getYearGan(): string; getMonthGan(): string; getDayGan(): string; getTimeGan(): string
    getYearZhi(): string; getMonthZhi(): string; getDayZhi(): string; getTimeZhi(): string
    getYearHideGan(): string[]; getMonthHideGan(): string[]; getDayHideGan(): string[]; getTimeHideGan(): string[]
    getYearNaYin(): string; getMonthNaYin(): string; getDayNaYin(): string; getTimeNaYin(): string
  }
  interface Lunar {
    getEightChar(): EightChar
    toString(): string
    getYearShengXiao(): string
    getPrevJieQi(): { getName(): string }
  }
  export const Solar: {
    fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): {
      getLunar(): Lunar
    }
  }
}
