export function getBadge(color?: string) {
    if (!color) {
        color = getRandomColor();
    }
    switch (color) {
        case "red":
            return `inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-500/10`;
        case "orange":
            return `inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-600 ring-1 ring-inset ring-orange-500/10`;
        case "yellow":
            return `inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-600 ring-1 ring-inset ring-yellow-500/10`;
        case "green":
            return `inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500/10`;
        case "blue":
            return `inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10`;
        case "indigo":
            return `inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 ring-1 ring-inset ring-indigo-500/10`;
        case "purple":
            return `inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-600 ring-1 ring-inset ring-purple-500/10`;
        case "pink":
            return `inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-600 ring-1 ring-inset ring-pink-500/10`;
    }
    return `inline-flex items-center rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-600 ring-1 ring-inset ring-violet-500/10`;
}

export function getRandomColor(): string {
    const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "purple", "pink"];
    return colors[Math.floor(Math.random() * colors.length)];
}
