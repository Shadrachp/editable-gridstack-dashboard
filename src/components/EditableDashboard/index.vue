<template>
  <div class="p-4 grid-container ">
    <div class="p-4 flex justify-end gap-1">
      <button @click="toggleEditMode" class="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        {{ editMode ? 'Disable Edit Mode' : 'Enable Edit Mode' }}
      </button>
      <button @click="addWidget" class="mb-4 px-4 py-2 bg-green-500 text-white rounded">
        Add Widget
      </button>
    </div>
    <div ref="grid" class="border-solid rounded-sm bg-white grid-stack"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.css';

const editMode = ref(false);
const widgets = ref([
  { id: 1, title: 'First Widget', grid: { x: 0, y: 0, w: 2, h: 2 } },
  { id: 2, title: 'Second Widget', grid: { x: 2, y: 0, w: 2, h: 1 } },
  { id: 3, title: 'Third Widget', grid: { x: 0, y: 2, w: 2, h: 1 } },
  { id: 4, title: 'Fourth Widget', grid: { x: 2, y: 2, w: 1, h: 2 } },
  { id: 5, title: 'Fifth Widget', grid: { x: 3, y: 2, w: 1, h: 2 } }
]);

const grid = ref(null);

onMounted(() => {
  const gs = GridStack.init({
    // column: 4,
    cellHeight: '100px',
    minRow: 1,
    margin: '10px',
  }, grid.value);

  grid.value._gs = gs;

  widgets.value.forEach(widget => {
    addWidgetToGrid(gs, widget);
  });

   gs?.setStatic(!editMode.value);

  // Event delegation for removing widgets
  grid.value.addEventListener('click', handleRemoveButtonClick);
});

const handleRemoveButtonClick = (event) => {
  const target = event.target;
  if (target.classList.contains('remove-widget')) {
    const widgetId = parseInt(target.dataset.id, 10);
    removeWidget(widgetId);
  }
};

const updateWidgetRemoveButtons = () => {
  const buttons = grid.value.querySelectorAll('.remove-widget');
  buttons.forEach(button => {
    button.style.display = editMode.value ? 'block' : 'none';
  });
};

const addWidgetToGrid = (gs, widget) => {
  const widgetHtml = `
    <div class="grid-stack-item" gs-id="${widget.id}" gs-x="${widget.grid.x}" gs-y="${widget.grid.y}" gs-w="${widget.grid.w}" gs-h="${widget.grid.h}">
      <div class="grid-stack-item-content p-2 bg-custom-midnight text-white grid-widget-item border rounded">
        <span>${widget.title}</span>
        <span class="widget-actions">
          <button class="remove-widget float-right text-red-500" data-id="${widget.id}">X</button>
        </span>
      </div>
    </div>
  `;
  
  gs.addWidget(widgetHtml);
  
  // Show or hide the remove button based on edit mode
  updateWidgetRemoveButtons();
};

const toggleEditMode = () => {
  editMode.value = !editMode.value;
  const gs = grid.value._gs;
  gs?.setStatic(!editMode.value);
  updateWidgetRemoveButtons(); // Update button visibility
};

const addWidget = () => {
  const newId = widgets.value.length + 1;
  const newWidget = {
    id: newId,
    title: `Widget ${newId}`,
    grid: { x: 0, y: 0, w: 2, h: 2 }
  };
  widgets.value.push(newWidget);
  const gs = grid.value._gs;
  addWidgetToGrid(gs, newWidget);
};

const removeWidget = (id) => {
  if (!editMode.value) return; 

  const gs = grid.value._gs;
  const widgetElement = grid.value.querySelector(`.grid-stack-item[gs-id="${id}"]`);
  if (widgetElement) {
    gs.removeWidget(widgetElement);
  }
};
</script>

<style scoped>
.grid-stack-item-content {
  display: flex;
  justify-content: space-between;
}
.remove-widget {
  cursor: pointer;
}
.grid-container {
  border-style: solid;
  border-width: 0;
  background-color: #0e1423;
}
.grid-widget-item {
  background-color: #172133!important;
}
</style>
