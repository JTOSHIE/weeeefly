import React, { useState } from 'react';
import SplitFlap from './SplitFlap'; 

function App() {
  const [origin, setOrigin] = useState('SYD');
  const [destination, setDestination] = useState('MEL');

  return (
    <div>
      <h1>Weeeefly</h1>
      <form>
        <div>
          <label htmlFor="origin">Origin:</label>
          <SplitFlap characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ " currentCharacterIndex={18} /> {/* 'S' */}
          <SplitFlap characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ " currentCharacterIndex={24} /> {/* 'Y' */}
          <SplitFlap characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ " currentCharacterIndex={3} />  {/* 'D' */}
        </div>

        <div>
          <label htmlFor="destination">Destination:</label>
          <SplitFlap characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ " currentCharacterIndex={12} /> {/* 'M' */}
          <SplitFlap characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ " currentCharacterIndex={4} />  {/* 'E' */}
          <SplitFlap characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ " currentCharacterIndex={11} /> {/* 'L' */}
        </div>

        {/* ... (add more input fields for dates, passengers, etc.) ... */}
      </form>
    </div>
  );
}

export default App;
