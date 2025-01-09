"use client";

const ImageGrid = ({ imageUrl, items }: { imageUrl: string; items: number }) => {
    const sqrt = Math.sqrt(items);
    if (!Number.isInteger(sqrt)) {
        throw new Error("Items must be a perfect square starting from 2².");
    }

    return (
        <div
            className="mx-auto mt-3"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${sqrt}, 1fr)`,
                gap: "5px",
                width: "300px", // Đặt kích thước cụ thể hoặc tuỳ chỉnh theo nhu cầu
                height: "300px",
                overflow: "hidden",
                border: "1px solid violet",
            }}
        >
            {Array.from({ length: items }).map((_, index) => (
                <div
                    key={index}
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: `${sqrt * 100}% ${sqrt * 100}%`,
                        backgroundPosition: `${(index % sqrt) * (100 / (sqrt - 1))}% ${
                            Math.floor(index / sqrt) * (100 / (sqrt - 1))
                        }%`,
                        width: "100%",
                        height: "100%",
                        border: "2px solid violet",
                    }}
                />
            ))}
        </div>
    );
};

export default ImageGrid;
