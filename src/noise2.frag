precision mediump float;

varying vec2 vUvs;
uniform float limit;
uniform sampler2D noise;

void main() {
    // 노이즈 샘플링 (불규칙한 번짐)
    float n = texture2D(noise, vUvs).r;

    // limit에 따라 타는 경계값 결정 (부드럽게)
    float burn = smoothstep(limit - 0.05, limit + 0.05, n);

    // 🔥 불빛 색상: 주황 → 붉은색
    vec3 fireColor = mix(
        vec3(1.0, 0.45, 0.1),   // 주황 (불)
        vec3(0.4, 0.0, 0.0),    // 붉은 재
        burn
    );
    // 🔄 알파값 조정
    // 초반엔 불빛 강하게 → 중반엔 연기처럼 희미하게 → 마지막엔 지도 다시 드러남
    float alpha;
    alpha = 1.0 - burn; // 불/연기 시기
    

    // 지도 복귀 시점 이후엔 완전히 투명 (지도만 남음)
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(fireColor, alpha);
}
