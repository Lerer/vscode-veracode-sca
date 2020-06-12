

export function getSeverityRatingFromCVSS(cvssValue: number): string {
    if (cvssValue<2.1 && cvssValue>=0.1) {
      return 'very_low';
    } else if (cvssValue<4.1){
      return 'low';
    } else if (cvssValue<6.1) {
      return 'medium';
    } else if (cvssValue<8.1) {
      return 'high';
    } else if (cvssValue<10.1) {
      return 'very_high';
    } 
    return 'informational';
}