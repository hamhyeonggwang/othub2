// 사회성숙도 검사 (SMS) 117문항
// 출처: Social Maturity Scale - 김승국·김옥기
// 카테고리: C=의사소통, S=사회화, SHG=자조일반, SHD=자조의복, SHE=자조식사, L=이동, O=작업, SD=자기관리

export const CATEGORY_LABELS = {
  C: '의사소통',
  S: '사회화',
  SHG: '자조(일반)',
  SHD: '자조(의복)',
  SHE: '자조(식사)',
  L: '이동',
  O: '작업',
  SD: '자기관리',
};

export const CATEGORY_COLORS = {
  C: 'bg-blue-100 text-blue-700',
  S: 'bg-purple-100 text-purple-700',
  SHG: 'bg-green-100 text-green-700',
  SHD: 'bg-emerald-100 text-emerald-700',
  SHE: 'bg-teal-100 text-teal-700',
  L: 'bg-orange-100 text-orange-700',
  O: 'bg-yellow-100 text-yellow-700',
  SD: 'bg-rose-100 text-rose-700',
};

export const AGE_GROUPS = [
  { label: '0~1세', range: [1, 28] },
  { label: '1~2세', range: [29, 36] },
  { label: '2~3세', range: [37, 47] },
  { label: '3~4세', range: [48, 55] },
  { label: '4~5세', range: [56, 60] },
  { label: '5~6세', range: [61, 65] },
  { label: '6~7세', range: [66, 69] },
  { label: '7~8세', range: [70, 75] },
  { label: '8~9세', range: [76, 78] },
  { label: '9~10세', range: [79, 80] },
  { label: '10~11세', range: [81, 85] },
  { label: '11~13세', range: [86, 89] },
  { label: '13~15세', range: [90, 94] },
  { label: '15~18세', range: [95, 100] },
  { label: '18~20세', range: [101, 103] },
  { label: '20~25세', range: [104, 109] },
  { label: '25세~', range: [110, 117] },
];

export const TEST_ITEMS = [
  // ─── 0~1세 ───────────────────────────────────────────────────────
  {
    id: 1, category: 'C', ageEquiv: 0.19,
    text: '깔깔대며 웃는다',
    desc: '혼자 좋아서 웃거나 자극을 주었을 때 웃는다',
  },
  {
    id: 2, category: 'SHG', ageEquiv: 0.20,
    text: '머리를 가눈다',
    desc: '머리를 받쳐주지 않아도 얼마동안(약 1분간) 머리를 치켜든다',
  },
  {
    id: 3, category: 'SHG', ageEquiv: 0.32,
    text: '손이 미치는 곳에 있는 물건을 붙잡는다',
    desc: null,
  },
  {
    id: 4, category: 'SHG', ageEquiv: 0.35,
    text: '가까우나 손이 미치지 않는 곳에 있는 물건을 잡으려고 손을 뻗는다',
    desc: null,
  },
  {
    id: 5, category: 'SHG', ageEquiv: 0.38,
    text: '혼자서 몸을 뒤집는다',
    desc: '남의 도움없이 누운 자세에서 엎드린 자세로 또는 그 반대로 뒤집는다',
  },
  {
    id: 6, category: 'S', ageEquiv: 0.43,
    text: '어머니나 아버지나 기타 친숙한 사람에게 치켜들거나 안아달라고 팔을 벌린다',
    desc: null,
  },
  {
    id: 7, category: 'SHG', ageEquiv: 0.48,
    text: '붙잡아 주지 않아도 1분 정도 앉아있는다',
    desc: null,
  },
  {
    id: 8, category: 'L', ageEquiv: 0.53,
    text: '방에서 배나 무릎으로 기어다닌다',
    desc: null,
  },
  {
    id: 9, category: 'O', ageEquiv: 0.54,
    text: '딸랑이와 같은 간단한 장난감을 가지고 15분 이상 혼자서 논다',
    desc: null,
  },
  {
    id: 10, category: 'C', ageEquiv: 0.56,
    text: '발음이 분명치 않은 애기 말을 한다',
    desc: null,
  },
  {
    id: 11, category: 'SHE', ageEquiv: 0.58,
    text: '도와주면 컵이나 그릇의 물을 마신다',
    desc: '컵이나 그릇을 입에다 대어주기를 바라거나 그것을 잡도록 도와주면 물을 마신다',
  },
  {
    id: 12, category: 'S', ageEquiv: 0.63,
    text: '다른 사람의 주의를 끌려고 한다',
    desc: '다른 사람이 자기에게 무슨 말을 해주기를 바라거나 자기에게 관심을 가져주길 바란다',
  },
  {
    id: 13, category: 'SHG', ageEquiv: 0.65,
    text: '사람이 아닌 물체를 붙잡고 일어선다',
    desc: null,
  },
  {
    id: 14, category: 'SHE', ageEquiv: 0.74,
    text: '평상시에는 침을 흘리지 않는다',
    desc: null,
  },
  {
    id: 15, category: 'SHG', ageEquiv: 0.78,
    text: '엄지와 다른 손가락으로 물건을 잡거나 집어든다',
    desc: '손바닥으로 주먹을 쥐듯이 잡는 것이 아니다',
  },
  {
    id: 16, category: 'SHG', ageEquiv: 0.83,
    text: '사람이나 물체를 잡지 않고도 약 1분간 혼자 일어서 있는다',
    desc: null,
  },
  {
    id: 17, category: 'C', ageEquiv: 0.94,
    text: '간단한 지시를 따른다',
    desc: '이리로 오라면 오고, 저리로 가라면 가고, 그림 속에 있는 것을 물으면 그것을 가리킨다',
  },
  {
    id: 18, category: 'L', ageEquiv: 1.01,
    text: '방에서 혼자 걸어다닌다',
    desc: '걸음마 한다',
  },
  {
    id: 19, category: 'SHD', ageEquiv: 1.09,
    text: '끈을 매지 않은 양말을 혼자서 벗는다',
    desc: null,
  },
  {
    id: 20, category: 'O', ageEquiv: 1.10,
    text: '연필이나 크레파스로 아무렇게나 그린다',
    desc: null,
  },
  {
    id: 21, category: 'SHE', ageEquiv: 1.10,
    text: '음식을 씹어먹는다',
    desc: null,
  },
  {
    id: 22, category: 'O', ageEquiv: 1.18,
    text: '물건을 옮긴다',
    desc: '물건을 다른 그릇에 옮겨 붓거나, 옮겨놓거나 늘어놓는다',
  },
  {
    id: 23, category: 'SHG', ageEquiv: 1.22,
    text: '밖에 나갈 때 걸어가려고 한다',
    desc: null,
  },
  {
    id: 24, category: 'SHG', ageEquiv: 1.24,
    text: '간단한 장애물을 처리한다',
    desc: '닫힌 문을 열거나, 의자에 기어오르거나 손이 미치지 않는 것을 잡기 위해 발판을 사용하거나, 막대기를 가지고 놀거나, 물건을 그릇에 담아가지고 논다',
  },
  {
    id: 25, category: 'O', ageEquiv: 1.29,
    text: '집안에서 물건을 가져오라면 가져오고, 갖다놓으라면 갖다놓는다',
    desc: null,
  },
  {
    id: 26, category: 'SHG', ageEquiv: 1.32,
    text: '자기 손으로 그릇을 들고 물을 마신다',
    desc: null,
  },
  {
    id: 27, category: 'S', ageEquiv: 1.34,
    text: '나이가 비슷한 다른 어린이들과 같이 한 자리에서 싸우지 않고 따로따로 논다',
    desc: null,
  },
  {
    id: 28, category: 'SHE', ageEquiv: 1.41,
    text: '숟가락으로 혼자서 음식을 많이 흘리지 않고 먹는다',
    desc: null,
  },

  // ─── 1~2세 ───────────────────────────────────────────────────────
  {
    id: 29, category: 'C', ageEquiv: 1.43,
    text: '늘 보는 물건의 이름을 대면서 달라고 하거나 가리킨다',
    desc: null,
  },
  {
    id: 30, category: 'L', ageEquiv: 1.47,
    text: '집안이나 뜰에서 혼자 돌아다닌다',
    desc: '어디서 무엇을 하고 있는지 별로 신경을 쓰지 않아도 좋을 정도다',
  },
  {
    id: 31, category: 'SHE', ageEquiv: 1.47,
    text: '먹을 수 있는 것과 먹을 수 없는 것을 구별한다',
    desc: null,
  },
  {
    id: 32, category: 'SHG', ageEquiv: 1.50,
    text: '대소변을 보려는 의사표시를 한다',
    desc: null,
  },
  {
    id: 33, category: 'SHE', ageEquiv: 1.51,
    text: '사탕이나 과자를 싼 종이를 제 손으로 벗기고 먹는다',
    desc: null,
  },
  {
    id: 34, category: 'L', ageEquiv: 1.64,
    text: '혼자서 층계를 걸어올라간다',
    desc: '기어올라가는 것이 아니라 층계의 난간이나 벽을 잡고 올라간다',
  },
  {
    id: 35, category: 'C', ageEquiv: 1.75,
    text: '짧은 문장으로 말을 한다',
    desc: '약 25개 이상의 낱말을 사용하여 짧은 문장이나 구를 만들어 쓴다',
  },
  {
    id: 36, category: 'O', ageEquiv: 1.77,
    text: '간단한 놀이를 즐겨한다',
    desc: '나무토막 쌓기 놀이를 하거나 그림책을 본다',
  },

  // ─── 2~3세 ───────────────────────────────────────────────────────
  {
    id: 37, category: 'SHG', ageEquiv: 2.02,
    text: '간단한 위험을 피한다',
    desc: '비를 피하거나, 낯선 사람을 경계하거나, 높은 곳에서 떨어지지 않기 위해 조심한다',
  },
  {
    id: 38, category: 'SHD', ageEquiv: 2.22,
    text: '젖은 손을 수건으로 비교적 잘 닦는다',
    desc: null,
  },
  {
    id: 39, category: 'SHD', ageEquiv: 2.23,
    text: '외투를 혼자서 벗는다',
    desc: null,
  },
  {
    id: 40, category: 'SHE', ageEquiv: 2.34,
    text: '물이 먹고 싶을 때에는 자기가 직접 물을 따라 먹거나 떠먹는다',
    desc: null,
  },
  {
    id: 41, category: 'S', ageEquiv: 2.48,
    text: '다른 어린이들과 같이 어울려 논다',
    desc: '소꿉놀이 같은 집단활동을 한다',
  },
  {
    id: 42, category: 'SHD', ageEquiv: 2.59,
    text: '외투를 혼자서 입는다',
    desc: '단추는 끼우지 못해도 좋다',
  },
  {
    id: 43, category: 'L', ageEquiv: 2.69,
    text: '혼자서 층계를 걸어내려간다',
    desc: '한 발로 한 계단씩 디디며 내려간다',
  },
  {
    id: 44, category: 'S', ageEquiv: 2.79,
    text: '다른 사람에게 칭찬을 받을 만한 재주를 피워보인다',
    desc: '이야기를 하거나, 노래를 하거나, 춤을 추어보인다',
  },
  {
    id: 45, category: 'C', ageEquiv: 2.81,
    text: '자기의 경험을 간단히 설명하거나 이야기를 함에 있어서 어느 정도 조리있게 한다',
    desc: null,
  },
  {
    id: 46, category: 'O', ageEquiv: 2.82,
    text: '집안에서 잔심부름을 한다',
    desc: '물건을 집어주거나, 밥상에 수저를 놓는다',
  },
  {
    id: 47, category: 'SHE', ageEquiv: 2.83,
    text: '젓가락으로 반찬을 집어먹는다',
    desc: null,
  },

  // ─── 3~4세 ───────────────────────────────────────────────────────
  {
    id: 48, category: 'O', ageEquiv: 2.96,
    text: '가위로 종이나 천을 자른다',
    desc: null,
  },
  {
    id: 49, category: 'L', ageEquiv: 3.06,
    text: '가까운 이웃집에 혼자서 놀러다닌다',
    desc: null,
  },
  {
    id: 50, category: 'SHG', ageEquiv: 3.14,
    text: '혼자서 대소변을 본다',
    desc: '대소변을 볼 때 간단한 옷을 혼자서 벗고 입는다',
  },
  {
    id: 51, category: 'SHD', ageEquiv: 3.18,
    text: '혼자서 손을 깨끗이 씻고 수건으로 잘 닦는다',
    desc: null,
  },
  {
    id: 52, category: 'SHD', ageEquiv: 3.52,
    text: '혼자서 외투를 입고 단추를 끼운다',
    desc: null,
  },
  {
    id: 53, category: 'O', ageEquiv: 3.55,
    text: '썰매나 세발자전거를 탄다',
    desc: null,
  },
  {
    id: 54, category: 'SHD', ageEquiv: 3.58,
    text: '특별히 입기 힘든 옷이 아니면 무슨 옷이든 다 입는다',
    desc: '매는 또는 뒤로 잠그는 옷이 아니면 다 입는다',
  },
  {
    id: 55, category: 'SHD', ageEquiv: 3.81,
    text: '혼자서 세수를 깨끗이 하고 수건으로 닦는다',
    desc: null,
  },

  // ─── 4~5세 ───────────────────────────────────────────────────────
  {
    id: 56, category: 'SD', ageEquiv: 4.01,
    text: '소액의 돈을 가지고 사오라는 물건을 사온다',
    desc: null,
  },
  {
    id: 57, category: 'S', ageEquiv: 4.07,
    text: '나이가 비슷한 3~4명의 어린이들과 어울려 경쟁적이며 활동적인 놀이를 한다',
    desc: '집지키기, 술래잡기, 줄넘기, 공기놀이, 팽이치기, 돌차기 등을 한다',
  },
  {
    id: 58, category: 'O', ageEquiv: 4.16,
    text: '연필이나 크레파스로 그림을 그린다',
    desc: '사람, 집, 나무, 동물 같은 것을 알아볼 수 있을 정도로 그린다',
  },
  {
    id: 59, category: 'L', ageEquiv: 4.28,
    text: '좀 멀더라도 가본 일이 있는 곳은 혼자 또는 친구와 같이 갔다 온다',
    desc: '놀이터, 학교, 교회 또는 유치원에 갔다 온다',
  },
  {
    id: 60, category: 'SHD', ageEquiv: 4.91,
    text: '혼자서 방에 들어가 옷을 벗고, 소변을 보고, 잠자리에 든다',
    desc: null,
  },

  // ─── 5~6세 ───────────────────────────────────────────────────────
  {
    id: 61, category: 'SHE', ageEquiv: 5.08,
    text: '칼이나 숟가락으로 빵이나 떡에 잼이나 꿀을 발라먹는다',
    desc: null,
  },
  {
    id: 62, category: 'C', ageEquiv: 5.14,
    text: '알아볼 수 있을 정도로 자기 이름이나 두서너 개의 낱말을 보지 않고 쓴다',
    desc: null,
  },
  {
    id: 63, category: 'SHD', ageEquiv: 5.24,
    text: '도움을 받아 목욕을 한다',
    desc: '머리나 등은 씻어주어야 하고 다른 부분도 도와주지 않으면 잘 씻지 못한다',
  },
  {
    id: 64, category: 'SHE', ageEquiv: 5.62,
    text: '칼로 먹을 것을 잘라먹는다',
    desc: null,
  },
  {
    id: 65, category: 'S', ageEquiv: 5.90,
    text: '자기 차례나 규칙을 알고 목표를 인식할 수 있어야 할 수 있는 앉아서 하는 게임을 한다',
    desc: '오목, 윷놀이, 고누, 다이아몬드 게임 같은 놀이를 한다',
  },

  // ─── 6~7세 ───────────────────────────────────────────────────────
  {
    id: 66, category: 'S', ageEquiv: 6.15,
    text: '특수한 기술이 없어도 할 수 있는 협동적인 집단놀이나 상상놀이를 한다',
    desc: '빈터에서 공차기나 공치기, 개울에서 고기잡기, 자전거타기, 학교놀이, 병원놀이, 상점놀이 등을 한다',
  },
  {
    id: 67, category: 'C', ageEquiv: 6.19,
    text: '12개 이상의 쉬운 낱말을 연필로 정확하게 쓴다',
    desc: null,
  },
  {
    id: 68, category: 'SHG', ageEquiv: 6.32,
    text: '시계를 대충 본다',
    desc: '시계를 보고 학교 갈 시간이나 식사 시간을 안다',
  },
  {
    id: 69, category: 'SHD', ageEquiv: 6.64,
    text: '손님이 올 때나 외출할 때에 머리를 빗거나 손질한다',
    desc: null,
  },

  // ─── 7~8세 ───────────────────────────────────────────────────────
  {
    id: 70, category: 'C', ageEquiv: 7.14,
    text: '간단한 읽을거리를 찾아 읽는다',
    desc: '만화 같은 쉽고 짧은 글을 읽는다',
  },
  {
    id: 71, category: 'L', ageEquiv: 7.18,
    text: '자기 동네에서는 혼자 또는 친구와 같이 어디든지 마음대로 돌아다닌다',
    desc: null,
  },
  {
    id: 72, category: 'SHE', ageEquiv: 7.19,
    text: '무슨 음식이든 남의 힘을 빌리지 않고 먹는다',
    desc: '칼로 과일을 깎아먹거나, 생선의 뼈를 가려내고 먹는다',
  },
  {
    id: 73, category: 'SD', ageEquiv: 7.20,
    text: '학용품 같은 간단한 물건을 산다',
    desc: '필요한 물건을 골라서 산다. 산 물건을 안전하게 다룬다. 정확하게 돈을 지불하고 거스름돈을 받는다',
  },
  {
    id: 74, category: 'S', ageEquiv: 7.23,
    text: '산타클로스나 귀신이나 도깨비는 존재하지 않는 것으로 믿고 있다',
    desc: null,
  },
  {
    id: 75, category: 'O', ageEquiv: 7.26,
    text: '연장을 사용한다',
    desc: '망치, 톱, 드라이버, 바늘, 호미 같은 연장을 사용한다',
  },

  // ─── 8~9세 ───────────────────────────────────────────────────────
  {
    id: 76, category: 'O', ageEquiv: 7.54,
    text: '일상적인 간단한 집안일을 한다',
    desc: '먼지털기, 정돈, 방을 쓸거나 닦기, 설거지하기, 밥상을 차리거나 치우기, 이부자리 깔기 같은 일을 한다',
  },
  {
    id: 77, category: 'SHD', ageEquiv: 8.05,
    text: '혼자서 목욕을 한다',
    desc: '머리를 잘 감지 못해도 몸은 비교적 깨끗이 씻는다',
  },
  {
    id: 78, category: 'C', ageEquiv: 8.07,
    text: '전화를 걸 줄 안다',
    desc: null,
  },

  // ─── 9~10세 ──────────────────────────────────────────────────────
  {
    id: 79, category: 'C', ageEquiv: 8.61,
    text: '친구나 친척에게 짤막한 편지를 쓴다',
    desc: null,
  },
  {
    id: 80, category: 'SD', ageEquiv: 9.13,
    text: '한 시간 이상 혼자서 집을 본다',
    desc: '전화받고, 방문객을 처리한다',
  },

  // ─── 10~11세 ─────────────────────────────────────────────────────
  {
    id: 81, category: 'SHD', ageEquiv: 10.08,
    text: '몸치장을 단정히 한다',
    desc: '다른 사람의 도움을 받지 않고 머리를 감고, 손톱을 깎고, 때에 따라 적절한 옷을 선택하여 입는다',
  },
  {
    id: 82, category: 'C', ageEquiv: 10.24,
    text: '책, 신문, 잡지 등을 즐겨 읽는다',
    desc: null,
  },
  {
    id: 83, category: 'O', ageEquiv: 10.40,
    text: '간단한 창의적인 일을 한다',
    desc: '창작, 구성, 도안, 수예 같은 일을 한다',
  },
  {
    id: 84, category: 'O', ageEquiv: 10.78,
    text: '약간의 보수를 받을 수 있는 일을 한다',
    desc: '집안살림, 바느질, 신문배달 같은 일을 한다',
  },
  {
    id: 85, category: 'S', ageEquiv: 10.80,
    text: '기술을 익히고 규칙과 득점방법을 이해해야 할 수 있는 복잡한 게임이나 스포츠를 한다',
    desc: '야구, 농구, 축구, 테니스, 탁구, 화투, 장기 등을 한다',
  },

  // ─── 11~13세 ─────────────────────────────────────────────────────
  {
    id: 86, category: 'L', ageEquiv: 11.65,
    text: '좀 먼 이웃 동네라도 혼자서 갔다 온다',
    desc: null,
  },
  {
    id: 87, category: 'C', ageEquiv: 12.13,
    text: '광고를 보고 우편으로 주문한다',
    desc: null,
  },
  {
    id: 88, category: 'SD', ageEquiv: 12.15,
    text: '낮에는 부모의 간섭을 받지 않고 어디든지 나다닐 수 있다',
    desc: '어디서나 행동을 조심한다',
  },
  {
    id: 89, category: 'SD', ageEquiv: 12.75,
    text: '자기가 가질 액세서리를 잘 선택하여 산다',
    desc: '리본, 신발, 장갑, 스카프 같은 물건을 산다',
  },

  // ─── 13~15세 ─────────────────────────────────────────────────────
  {
    id: 90, category: 'SD', ageEquiv: 13.04,
    text: '자기가 가진 돈을 유용하게 쓴다',
    desc: '돈을 쓸 데와 안 쓸 데를 가려쓴다',
  },
  {
    id: 91, category: 'C', ageEquiv: 13.33,
    text: '편지로 중요한 정보를 교환하거나 사교한다',
    desc: '비교적 격식에 맞게 잘 쓴다',
  },
  {
    id: 92, category: 'S', ageEquiv: 13.63,
    text: '협동을 요하는 집단활동에 적극 참여한다',
    desc: '클럽이나 운동경기팀의 한 성원이 되어 계획을 수립하고 수행한다',
  },
  {
    id: 93, category: 'C', ageEquiv: 13.69,
    text: '시사문제에 관심을 가진다',
    desc: '뉴스, 스포츠, 화제거리 등에 계속 관심을 표시한다',
  },
  {
    id: 94, category: 'O', ageEquiv: 14.05,
    text: '일상적인 집안일을 맡아 책임지고 한다',
    desc: '빨래, 부엌일, 정원가꾸기, 유리창 닦기 같은 일을 계속해서 한다',
  },

  // ─── 15~18세 ─────────────────────────────────────────────────────
  {
    id: 95, category: 'SD', ageEquiv: 14.96,
    text: '자기의 건강은 자기가 돌본다',
    desc: '질병이나 사고를 적절히 예방하고, 가벼운 상처는 자기가 직접 처치하고, 필요할 땐 직접 전문의를 찾아간다',
  },
  {
    id: 96, category: 'L', ageEquiv: 15.85,
    text: '가본 일이 없는 아주 먼 시골이나 도시에 혼자 갔다 올 수 있다',
    desc: null,
  },
  {
    id: 97, category: 'SD', ageEquiv: 16.64,
    text: '자기 돈의 지출은 자기가 결정해서 한다',
    desc: '많은 돈의 지출에 있어서 신중하게 그리고 책임있게 한다',
  },
  {
    id: 98, category: 'SD', ageEquiv: 16.73,
    text: '자기 옷은 무엇이든 자기가 정해서 직접 산다',
    desc: null,
  },
  {
    id: 99, category: 'SD', ageEquiv: 17.01,
    text: '밤에도 부모의 제지를 별로 받지 않고 집을 나가 다닐 수 있다',
    desc: '부모가 방임하기 때문이 아니라 사고없이 다닐 수 있다고 믿어 밤에 외출하는 것을 제지하지 않는다',
  },
  {
    id: 100, category: 'SD', ageEquiv: 17.18,
    text: '책임있고 분별있는 행동을 한다',
    desc: '타인의 복지와 사회적 관습을 고려하여 신중하게 처신한다',
  },

  // ─── 18~20세 ─────────────────────────────────────────────────────
  {
    id: 101, category: 'SD', ageEquiv: 17.93,
    text: '돈을 분수에 맞게 쓴다',
    desc: '수입 범위내에서 생활한다. 낭비 또는 사치를 안한다. 필요한 경우에만 돈을 쓴다',
  },
  {
    id: 102, category: 'O', ageEquiv: 17.95,
    text: '직업을 가지고 있거나, 고등학교를 졸업한 후 계속해서 공부를 하고 있다',
    desc: '이발사, 기능공, 가정부, 목공 또는 학업에 종사하고 있다',
  },
  {
    id: 103, category: 'S', ageEquiv: 19.77,
    text: '가까운 사람을 돕는다',
    desc: '물질적으로나 정신적으로 지원한다',
  },

  // ─── 20~25세 ─────────────────────────────────────────────────────
  {
    id: 104, category: 'O', ageEquiv: 20.00,
    text: '일을 효과적이고 능률적으로 할 수 있는 방안을 수립한다',
    desc: null,
  },
  {
    id: 105, category: 'O', ageEquiv: 20.12,
    text: '여가를 선용한다',
    desc: '여가에 독서, 게임, 스포츠, 취미생활, 음악, 미술, 연극을 함으로써 정신적 및 신체적 건강을 도모한다',
  },
  {
    id: 106, category: 'S', ageEquiv: 22.19,
    text: '다른 사람의 신뢰를 받는다',
    desc: '리더십이나 현명한 판단으로 다른 사람의 어려움을 해결해준다',
  },
  {
    id: 107, category: 'SD', ageEquiv: 22.84,
    text: '경제적인 자립 준비를 한다',
    desc: '장래를 위해 저축, 보험가입 또는 투자를 한다',
  },
  {
    id: 108, category: 'O', ageEquiv: 22.86,
    text: '숙련직에 종사한다',
    desc: '사무원, 기술자, 간호사, 농부, 상인으로 취업하고 있거나 대학의 상급생으로 계속 공부하고 있다',
  },
  {
    id: 109, category: 'S', ageEquiv: 24.58,
    text: '사회복지에 기여한다',
    desc: '지역사회를 위한 봉사활동에 적극 참가한다',
  },

  // ─── 25세~ ───────────────────────────────────────────────────────
  {
    id: 110, category: 'S', ageEquiv: 26.60,
    text: '전반적인 사회복지 문제에 관심을 가지고 있다',
    desc: '종교, 교육, 문화, 과학 및 산업을 발전시키고 국가와 인류를 위해 무엇인가 해야겠다는 뜻을 품고 있다',
  },
  {
    id: 111, category: 'S', ageEquiv: 27.76,
    text: '사회 발전에 기여한다',
    desc: '자기 직업에 충실하는 것이외에 경제, 산업, 교육 및 문화의 발전을 위한 운동에 적극 참여한다',
  },
  {
    id: 112, category: 'SD', ageEquiv: 28.39,
    text: '가족이나 친척 이외의 다른 사람을 경제적으로 돕는다',
    desc: null,
  },
  {
    id: 113, category: 'O', ageEquiv: 28.72,
    text: '전문직에 종사한다',
    desc: null,
  },
  {
    id: 114, category: 'O', ageEquiv: 28.98,
    text: '창의적인 활동이나 개발업무에 종사한다',
    desc: null,
  },
  {
    id: 115, category: 'O', ageEquiv: 29.61,
    text: '소규모의 사업을 경영하거나, 직장에서 중간관리직에 종사한다',
    desc: null,
  },
  {
    id: 116, category: 'S', ageEquiv: 29.85,
    text: '지역사회의 책임을 분담한다',
    desc: '지역사회를 위한 조직의 일반적인 관리책임을 진다',
  },
  {
    id: 117, category: 'O', ageEquiv: 30.00,
    text: '계획을 수립하고 지휘감독하는 상급관리직에 종사한다',
    desc: null,
  },
];
