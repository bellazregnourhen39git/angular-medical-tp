import { Cim10Pipe } from './cim10.pipe';

describe('Cim10Pipe', () => {
  it('create an instance', () => {
    const pipe = new Cim10Pipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform CIM10 code to label', () => {
    const pipe = new Cim10Pipe();
    expect(pipe.transform('I10')).toContain('Hypertension');
  });

  it('should return code if not found', () => {
    const pipe = new Cim10Pipe();
    expect(pipe.transform('XXXX')).toBe('XXXX');
  });
});
