const readlineSync = require('readline-sync');

const monster = {
  maxHealth: 10,
  name: 'Лютый',
  moves: [
    {
      name: 'Удар когтистой лапой',
      physicalDmg: 3, // физический урон
      magicDmg: 0, // магический урон
      physicArmorPercents: 20, // физическая броня
      magicArmorPercents: 20, // магическая броня
      cooldown: 0, // ходов на восстановление
      isAvailable: true, // доступность хода
      stepWhenLastUsed: 0, // счетчик последнего использования хода
    },
    {
      name: 'Огненное дыхание',
      physicalDmg: 0,
      magicDmg: 4,
      physicArmorPercents: 0,
      magicArmorPercents: 0,
      cooldown: 3,
      isAvailable: true,
      stepWhenLastUsed: 0,
    },
    {
      name: 'Удар хвостом',
      physicalDmg: 2,
      magicDmg: 0,
      physicArmorPercents: 50,
      magicArmorPercents: 0,
      cooldown: 2,
      isAvailable: true,
      stepWhenLastUsed: 0,
    },
  ],
};

const mage = {
  maxHealth: 0,
  name: 'Евстафий',
  moves: [
    {
      name: 'Удар боевым кадилом',
      physicalDmg: 2,
      magicDmg: 0,
      physicArmorPercents: 0,
      magicArmorPercents: 50,
      cooldown: 0,
      isAvailable: true,
      stepWhenLastUsed: 0,
    },
    {
      name: 'Вертушка левой пяткой',
      physicalDmg: 4,
      magicDmg: 0,
      physicArmorPercents: 0,
      magicArmorPercents: 0,
      cooldown: 4,
      isAvailable: true,
      stepWhenLastUsed: 0,
    },
    {
      name: 'Каноничный фаербол',
      physicalDmg: 0,
      magicDmg: 5,
      physicArmorPercents: 0,
      magicArmorPercents: 0,
      cooldown: 3,
      isAvailable: true,
      stepWhenLastUsed: 0,
    },
    {
      name: 'Магический блок',
      physicalDmg: 0,
      magicDmg: 0,
      physicArmorPercents: 100,
      magicArmorPercents: 100,
      cooldown: 4,
      isAvailable: true,
      stepWhenLastUsed: 0,
    },
  ],
};

mage.maxHealth = readlineSync.question(
  'Привет! Для начала игры выбери сложность, введи максимальное количество здоровья своего героя: \n'
);

let currentStep = 0;
let moveCounter = 1;

// Random choice of monster move
function monsterMove(arrayOfMonsterMoves) {
  let idexesOfAvailableMoves = arrayOfMonsterMoves
    .map((value, index) => {
      if (!value.isAvailable) {
        arrayOfMonsterMoves[index].stepWhenLastUsed++;

        return null;
      } else {
        return index;
      }
    })
    .filter(value => {
      return value !== null;
    });

  let randomIndex =
    idexesOfAvailableMoves[
      Math.floor(Math.random() * idexesOfAvailableMoves.length)
    ];

  let action = arrayOfMonsterMoves[randomIndex];

  arrayOfMonsterMoves.forEach(item => {
    if (action.name === item.name && item.cooldown !== 0) {
      item.isAvailable = false;
    }
    if (item.stepWhenLastUsed > item.cooldown) {
      item.stepWhenLastUsed = 0;
      item.isAvailable = true;
    }
  });

  return action;
}

// Get the list of available mage moves
function getMageMoves() {
  return mage.moves.map(item => {
    let mageMove = item.name;

    if (item.stepWhenLastUsed === item.cooldown) {
      item.isAvailable = true;
      item.stepWhenLastUsed = 0;
    }
    if (!item.isAvailable) {
      let stepWhenLastUsed = item.stepWhenLastUsed + 1;

      if (stepWhenLastUsed <= currentStep) {
        // The value of last move cannot be higer than currentStep
        item.stepWhenLastUsed = stepWhenLastUsed;
      }

      mageMove = `${item.name} - (Этот ход сейчас не доступен)`;
    }

    return mageMove;
  });
}

while (mage.maxHealth != 0 && monster.maxHealth != 0) {
  console.log(
    `\n ========================================= Ход №${moveCounter} ================================================ \n`
  );
  let monster_move = monsterMove(monster.moves);
  console.log(`\n Вы видите, монстр собирается использовать: ${monster_move.name} \n`);

  console.log('\n Выберите ответное действие из доступных вариантов: \n');
  let index = readlineSync.keyInSelect(getMageMoves(), 'Введите цифру: ');

  while (index !== -1 && !mage.moves[index].isAvailable) {
    console.log(
      `\n Действие "${mage.moves[index].name}" сейчас недоступно. Выбери другое: \n`
    );
    index = readlineSync.keyInSelect(getMageMoves(), 'Введите цифру: ');
  }

  if (index === -1) {
    console.log('Вы вышли из игры');
    break;
  }

  let mage_move = mage.moves[index];

  currentStep++;
  moveCounter++;

  console.log(
    `\n ================================ Взаимное нанесение урона ======================================= \n`
  );
  console.log('Отлично, вы использовали: ' + mage_move.name);

  // Set availiable property to false in case of Cooldown
  if (mage_move.cooldown !== 0) {
    mage.moves[index].isAvailable = false;
  }

  monster.maxHealth -= getMonsterHealthDrop(mage_move, monster_move);

  console.log('Вы атаковали монстра!');
  console.log(`Здоровье монстра: ${monster.maxHealth}\n`);

  mage.maxHealth -= getMageHealthDrop(mage_move, monster_move);

  console.log('Ходит монстр: ' + monster_move.name);
  console.log(`Ваше здоровье: ${mage.maxHealth}\n`);

  if (mage.maxHealth <= 0) {
    console.log('Конец игры! Вы проиграли!');
    break;
  } else if (monster.maxHealth <= 0) {
    console.log('Поздравляю! Вы выиграли!');
    break;
  }

  function getDefense(damage, armorPercents) {
    return (damage / 100) * armorPercents;
  }

  function getMageHealthDrop(mageMove, monsterMove) {
    let magePhysicDefense = getDefense(
      monsterMove.physicalDmg,
      mageMove.physicArmorPercents
    );

    let mageMagicDefense = getDefense(
      monsterMove.magicDmg,
      mageMove.magicArmorPercents
    );

    return (
      monsterMove.physicalDmg -
      magePhysicDefense +
      (monsterMove.magicDmg - mageMagicDefense)
    );
  }

  function getMonsterHealthDrop(mageMove, monsterMove) {
    let monsterPhysicDefense = getDefense(
      mageMove.physicalDmg,
      monsterMove.physicArmorPercents
    );

    let monsterMagicDefense = getDefense(
      mageMove.magicDmg,
      monsterMove.magicArmorPercents
    );

    return (
      mageMove.physicalDmg -
      monsterPhysicDefense +
      (mageMove.magicDmg - monsterMagicDefense)
    );
  }
}
