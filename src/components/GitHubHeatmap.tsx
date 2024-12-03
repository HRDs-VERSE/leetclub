import React from 'react';

const colorScale = ['#161C22', '#0e4429', '#006d32', '#26a641', '#39d353'];

const getColor = (count: number) => {
  if (count >= 30) return colorScale[4];
  if (count >= 20) return colorScale[3];
  if (count >= 10) return colorScale[2];
  if (count >= 1) return colorScale[1];
  return colorScale[0];
};

const transformDataForWeeks = (contribution: { date: string; count: number }[]) => {
  const weeks: { date: string; count: number }[][] = Array.from({ length: 7 }, () => []);
  contribution?.forEach((day, index) => {
    const weekIndex = Math.floor(index / 7);
    weeks[index % 7][weekIndex] = day;
  });
  return weeks;
};

const GitHubHeatmap = ({ contribution }: any) => {
  const transformedData = transformDataForWeeks(contribution);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'repeat(7, 10px)', // 7 days in a week
        gridAutoFlow: 'column', // Flip the layout to match GitHub's style
        gap: '1px',
        maxWidth: '100%',
        overflowX: 'auto',
        scrollbarWidth: 'thin', // For Firefox
        WebkitOverflowScrolling: 'touch', // Smooth scrolling on mobile
      }}
    >
      {transformedData.map((week, rowIndex) =>
        week.map((day, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            title={`${day?.date || 'No data'}: ${day?.count || 0} contributions`}
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: day ? getColor(day.count) : colorScale[0],
              borderRadius: '2px',
              boxShadow: '0 0 2px rgba(0, 0, 0, 0.1)',
            }}
          />
        ))
      )}

      <style>{`
        div::-webkit-scrollbar {
          height: 4px; /* Adjust the height for horizontal scrollbar */
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 100, 0.5); /* Dark gray scroll thumb */
          border-radius: 2px; /* Rounded corners */
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 100, 100, 0.8); /* Slightly darker on hover */
        }
        div::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1); /* Light track background */
        }
      `}</style>
    </div>
  );
};

export default GitHubHeatmap;
