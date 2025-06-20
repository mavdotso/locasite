# Testing Columns Drop Zone

## How to Test

1. Navigate to the visual editor at http://localhost:3001
2. Add a "Columns Block" from the component library
3. Try dropping components into specific columns
4. Each column should have its own drop zones
5. Components should stay in their assigned columns
6. When changing the number of columns, components should redistribute properly

## Expected Behavior

- Each column should show separate drop zones
- Dropping a component in Column 1 should keep it in Column 1
- Dropping a component in Column 2 should keep it in Column 2
- The column metadata should be preserved when saving/loading

## Implementation Details

The ColumnsDropZone component:
- Tracks which column each child belongs to using metadata
- Creates separate drop zones for each column
- Calculates the correct insertion index when dropping components
- Preserves column assignments when components are moved