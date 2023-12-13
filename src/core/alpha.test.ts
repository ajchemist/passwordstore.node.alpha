import { describe, it, expect } from '@jest/globals';
import { show } from './alpha';

describe('alpha module', () => {
    it('returns null for invalid pass name', async () => {
      await expect(show('')).rejects.toThrow('Invalid pass name');
    });
  
    // 다른 테스트 케이스 추가
    // 예: 올바른 passName에 대한 show 함수의 동작 테스트
    // 주의: 실제 pass 명령어를 호출하는 것은 테스트 환경에서 복잡할 수 있으므로,
    // 이를 모의 처리하는 것을 고려할 수 있습니다.

    it('returns simple password', async () => {
        const expected = '123456';
        const password = await show('test/simple');
        expect(password).toMatch(new RegExp(expected, "g"));
    })
});