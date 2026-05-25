const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    content = content.replace(/w-full max-w-\[420px\] p-8/g, 'w-full max-w-[420px] p-5 md:p-8');
    content = content.replace(/w-full max-w-\[500px\] p-8/g, 'w-full max-w-[500px] p-5 md:p-8');
    content = content.replace(/w-full max-w-\[500px\] p-12/g, 'w-full max-w-[500px] p-6 md:p-12');
    content = content.replace(/w-full max-w-\[650px\] p-10/g, 'w-full max-w-[650px] p-6 md:p-10');
    content = content.replace(/w-full max-w-\[650px\] p-12/g, 'w-full max-w-[650px] p-6 md:p-12');
    content = content.replace(/w-full max-w-sm p-6/g, 'w-full max-w-sm p-5 md:p-6');
    content = content.replace(/w-full max-w-md p-6/g, 'w-full max-w-md p-5 md:p-6');
    content = content.replace(/w-full max-w-\[340px\] p-8 md:p-10/g, 'w-full max-w-[340px] p-6 md:p-10');
    content = content.replace(/w-full max-w-sm p-8/g, 'w-full max-w-sm p-6 md:p-8');
    content = content.replace(/max-w-\[450px\] rounded-\[30px\] shadow-2xl border-2 border-\[#8B0000\] p-6/g, 'max-w-[450px] rounded-[20px] md:rounded-[30px] shadow-2xl border-2 border-[#8B0000] p-5 md:p-6');
    content = content.replace(/w-full max-w-\[340px\] p-6/g, 'w-full max-w-[340px] p-5 md:p-6');
    content = content.replace(/w-full max-w-\[500px\] p-6/g, 'w-full max-w-[500px] p-5 md:p-6');
    content = content.replace(/w-full max-w-\[600px\] p-6/g, 'w-full max-w-[600px] p-5 md:p-6');

    // For large fonts in modals
    content = content.replace(/text-\[22px\]/g, 'text-xl md:text-[22px]');
    content = content.replace(/text-\[24px\]/g, 'text-2xl md:text-[24px]');
    content = content.replace(/text-\[28px\]/g, 'text-2xl md:text-[28px]');
    content = content.replace(/text-\[32px\]/g, 'text-2xl md:text-[32px]');
    content = content.replace(/text-\[36px\]/g, 'text-3xl md:text-[36px]');
    content = content.replace(/text-\[42px\]/g, 'text-3xl md:text-[42px]');

    // Specific button paddings
    content = content.replace(/py-4 rounded-\[16px\] font-extrabold text-\[20px\]/g, 'py-3 md:py-4 rounded-xl md:rounded-[16px] font-extrabold text-lg md:text-[20px]');
    content = content.replace(/py-4 rounded-\[14px\] font-extrabold text-\[18px\]/g, 'py-3 md:py-4 rounded-xl md:rounded-[14px] font-extrabold text-base md:text-[18px]');
    content = content.replace(/px-8 py-2\.5 rounded-\[8px\] font-bold text-\[15px\]/g, 'px-4 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-[8px] font-bold text-sm md:text-[15px]');
    content = content.replace(/py-3 rounded-\[10px\] font-bold text-\[15px\]/g, 'py-2 md:py-3 rounded-[10px] font-bold text-sm md:text-[15px]');

    // Flex gaps
    content = content.replace(/flex gap-4/g, 'flex flex-col sm:flex-row gap-3 sm:gap-4');
    content = content.replace(/flex gap-5/g, 'flex flex-col sm:flex-row gap-3 sm:gap-5');
    content = content.replace(/flex justify-end gap-5/g, 'flex flex-col sm:flex-row justify-end gap-3 sm:gap-5');

    // Add w-full to buttons inside modals if they are in flex-row previously
    content = content.replace(/className=\"flex-1 /g, 'className=\"w-full sm:flex-1 ');

    // Add min-w-0 for flex items if they overflow
    // Not needed blindly

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated', filePath);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

walk('./app');
