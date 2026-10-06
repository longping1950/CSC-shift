/**
 * 輪班演算法推演核心 (支援 ABCD 與 EFG 完整定位、批次抽取與輪替位移)
 */
window.ShiftCore = {
    STARTS_4B3R: { 'A': 18, 'B': 3, 'C': 8, 'D': 13 },
    CYCLE_4B3R: [
        { shift: "中", seq: 1, max: 5, a1: "+2/+3", a2: "", rules: { 1: { type: 'overtime', slots: [1], duration: 2 }, 2: { type: 'overtime', slots: [3], duration: 1 }, 3: { type: 'overtime', slots: [3], duration: 1 }, 4: { type: 'leave', slots: [4, 5], duration: 2 }, 5: { type: 'leave', slots: [4, 5], duration: 2 } } },
        { shift: "中", seq: 2, max: 5, a1: "+2",    a2: "+1/+3", rules: { 1: { error: '禁止加班' }, 2: { type: 'overtime', slots: [3], duration: 1 }, 3: { type: 'overtime', slots: [3], duration: 1 }, 4: { type: 'leave', slots: [4, 5], duration: 2 }, 5: { type: 'leave', slots: [4, 5], duration: 2 } } },
        { shift: "中", seq: 3, max: 5, a1: "+1/+2", a2: "", rules: { 1: { error: '禁止加班' }, 2: { type: 'overtime', slots: [3], duration: 1 }, 3: { type: 'overtime', slots: [3], duration: 1 }, 4: { type: 'leave', slots: [4, 5], duration: 2 }, 5: { type: 'leave', slots: [4, 5], duration: 2 } } },
        { shift: "中", seq: 4, max: 5, a1: "+3",    a2: "+1/+2", rules: { 1: { error: '禁止加班' }, 2: { type: 'overtime', slots: [3], duration: 1 }, 3: { type: 'overtime', slots: [3], duration: 1 }, 4: { type: 'leave', slots: [4, 5], duration: 2 }, 5: { type: 'leave', slots: [4, 5], duration: 2 } } },
        { shift: "中", seq: 5, max: 5, a1: "+3",    a2: "+1/+2", rules: { 1: { error: '禁止加班' }, 2: { type: 'overtime', slots: [3], duration: 1 }, 3: { type: 'overtime', slots: [3], duration: 1 }, 4: { type: 'leave', slots: [4, 5], duration: 2 }, 5: { type: 'leave', slots: [4, 5], duration: 2 } } },
        
        { shift: "休", seq: 1, max: 1, a1: "", a2: "", rules: { 1: { error: '禁止加班' }, 2: { error: '禁止加班' }, 3: { error: '禁止加班' }, 4: { error: '禁止加班' }, 5: { error: '禁止加班' } } },
        
        { shift: "早", seq: 1, max: 5, a1: "+1", a2: "+2/+3", rules: { 1: { error: '禁止加班' }, 2: { type: 'leave', slots: [2, 3], duration: 2 }, 3: { type: 'leave', slots: [2, 3], duration: 2 }, 4: { type: 'overtime', slots: [4], duration: 1 }, 5: { type: 'overtime', slots: [4], duration: 1 } } },
        { shift: "早", seq: 2, max: 5, a1: "+1", a2: "+2/+3", rules: { 1: { error: '禁止加班' }, 2: { type: 'leave', slots: [2, 3], duration: 2 }, 3: { type: 'leave', slots: [2, 3], duration: 2 }, 4: { type: 'overtime', slots: [4], duration: 1 }, 5: { type: 'overtime', slots: [4], duration: 1 } } },
        { shift: "早", seq: 3, max: 5, a1: "+2", a2: "+1/+3", rules: { 1: { error: '禁止加班' }, 2: { type: 'leave', slots: [2, 3], duration: 2 }, 3: { type: 'leave', slots: [2, 3], duration: 2 }, 4: { type: 'overtime', slots: [4], duration: 1 }, 5: { type: 'overtime', slots: [4], duration: 1 } } },
        { shift: "早", seq: 4, max: 5, a1: "+2", a2: "+1/+3", rules: { 1: { error: '禁止加班' }, 2: { type: 'leave', slots: [2, 3], duration: 2 }, 3: { type: 'leave', slots: [2, 3], duration: 2 }, 4: { type: 'overtime', slots: [4], duration: 1 }, 5: { type: 'overtime', slots: [4], duration: 1 } } },
        { shift: "早", seq: 5, max: 5, a1: "+1/+2", a2: "", rules: { 1: { error: '禁止加班' }, 2: { type: 'leave', slots: [2, 3], duration: 2 }, 3: { type: 'leave', slots: [2, 3], duration: 2 }, 4: { type: 'overtime', slots: [4], duration: 1 }, 5: { type: 'overtime', slots: [4], duration: 1 } } },
        
        { shift: "休", seq: 1, max: 2, a1: "", a2: "", rules: { 1: { type: 'overtime', slots: [1], duration: 2 }, 2: { type: 'overtime', slots: [2, 3], duration: 2 }, 3: { type: 'overtime', slots: [2, 3], duration: 2 }, 4: { type: 'overtime', slots: [4, 5], duration: 2 }, 5: { type: 'overtime', slots: [4, 5], duration: 2 } } },
        { shift: "休", seq: 2, max: 2, a1: "", a2: "", rules: { 1: { type: 'overtime', slots: [1], duration: 2 }, 2: { type: 'overtime', slots: [2, 3], duration: 2 }, 3: { type: 'overtime', slots: [2, 3], duration: 2 }, 4: { type: 'overtime', slots: [5], duration: 1 }, 5: { type: 'overtime', slots: [5], duration: 1 } } },
        
        { shift: "夜", seq: 1, max: 5, a1: "+1", a2: "", rules: { 1: { type: 'leave', slots: [1], duration: 2 }, 2: { type: 'overtime', slots: [2], duration: 1 }, 3: { type: 'overtime', slots: [2], duration: 1 }, 4: { type: 'overtime', slots: [5], duration: 1 }, 5: { type: 'overtime', slots: [5], duration: 1 } } },
        { shift: "夜", seq: 2, max: 5, a1: "+1", a2: "", rules: { 1: { type: 'leave', slots: [1], duration: 2 }, 2: { type: 'overtime', slots: [2], duration: 1 }, 3: { type: 'overtime', slots: [2], duration: 1 }, 4: { type: 'overtime', slots: [5], duration: 1 }, 5: { type: 'overtime', slots: [5], duration: 1 } } },
        { shift: "夜", seq: 3, max: 5, a1: "+1", a2: "", rules: { 1: { type: 'leave', slots: [1], duration: 2 }, 2: { type: 'overtime', slots: [2], duration: 1 }, 3: { type: 'overtime', slots: [2], duration: 1 }, 4: { type: 'overtime', slots: [5], duration: 1 }, 5: { type: 'overtime', slots: [5], duration: 1 } } },
        { shift: "夜", seq: 4, max: 5, a1: "+3", a2: "", rules: { 1: { type: 'leave', slots: [1], duration: 2 }, 2: { type: 'overtime', slots: [2], duration: 1 }, 3: { type: 'overtime', slots: [2], duration: 1 }, 4: { type: 'overtime', slots: [5], duration: 1 }, 5: { type: 'overtime', slots: [5], duration: 1 } } },
        { shift: "夜", seq: 5, max: 5, a1: "+3", a2: "", rules: { 1: { type: 'leave', slots: [1], duration: 2 }, 2: { type: 'overtime', slots: [2], duration: 1 }, 3: { type: 'overtime', slots: [2], duration: 1 }, 4: { error: '禁止加班' }, 5: { error: '禁止加班' } } },
        
        { shift: "休", seq: 1, max: 2, a1: "", a2: "", rules: { 1: { type: 'overtime', slots: [1], duration: 2 }, 2: { type: 'overtime', slots: [2, 3], duration: 2 }, 3: { type: 'overtime', slots: [2, 3], duration: 2 }, 4: { type: 'overtime', slots: [4, 5], duration: 2 }, 5: { type: 'overtime', slots: [4, 5], duration: 2 } } },
        { shift: "休", seq: 2, max: 2, a1: "", a2: "", rules: { 1: { type: 'overtime', slots: [1], duration: 2 }, 2: { type: 'overtime', slots: [2, 3], duration: 2 }, 3: { type: 'overtime', slots: [2, 3], duration: 2 }, 4: { type: 'overtime', slots: [4, 5], duration: 2 }, 5: { type: 'overtime', slots: [4, 5], duration: 2 } } }
    ],

    // 3班3輪定義 (21天循環)
    EFG_CYCLE: [
        { shift: "中", seq: 1, max: 5 }, { shift: "中", seq: 2, max: 5 }, { shift: "中", seq: 3, max: 5 }, { shift: "中", seq: 4, max: 5 }, { shift: "中", seq: 5, max: 5 },
        { shift: "休", seq: 1, max: 2 }, { shift: "休", seq: 2, max: 2 }, 
        { shift: "早", seq: 1, max: 6 }, { shift: "早", seq: 2, max: 6 }, { shift: "早", seq: 3, max: 6 }, { shift: "早", seq: 4, max: 6 }, { shift: "早", seq: 5, max: 6 }, { shift: "早", seq: 6, max: 6 },
        { shift: "休", seq: 1, max: 1 }, 
        { shift: "休", seq: 1, max: 1 }, { shift: "夜", seq: 1, max: 5 }, { shift: "夜", seq: 2, max: 5 }, { shift: "夜", seq: 3, max: 5 }, { shift: "夜", seq: 4, max: 5 }, { shift: "夜", seq: 5, max: 5 },
        { shift: "休", seq: 1, max: 1 }  
    ],
    EFG_OFFSETS: { 'E': 0, 'F': 7, 'G': 14 },
    EFG_BASE_DATE_UTC: Date.UTC(2026, 0, 26),

    STYLES: {
        '早': 'bg-[#9dd7db] text-[#005f6b] dark:bg-[#005f6b] dark:text-[#9dd7db] border border-[#005f6b]/20',
        '中': 'bg-[#ceb98d] text-[#5c450a] dark:bg-[#5c450a] dark:text-[#ceb98d] border border-[#5c450a]/20',
        '夜': 'bg-[#c6a1cf] text-[#4a1f5c] dark:bg-[#4a1f5c] dark:text-[#c6a1cf] border border-[#4a1f5c]/20',
        '休': 'bg-transparent text-slate-400'
    },
    
    getIndex(date, group) {
        const targetUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        if (['A', 'B', 'C', 'D'].includes(group)) {
            const ordinalDate = Math.floor(targetUTC / 86400000);
            return (ordinalDate + this.STARTS_4B3R[group] + 200000) % 20;
        } else if (['E', 'F', 'G'].includes(group)) {
            const dayDiff = Math.floor((targetUTC - this.EFG_BASE_DATE_UTC) / 86400000);
            let index = (dayDiff + this.EFG_OFFSETS[group]) % 21;
            if (index < 0) index += 21;
            return index;
        }
        return -1;
    },

    getRecords(startIndex, count = 1, group = 'A', options = {}) {
        if (startIndex < 0) return [];
        const isEFG = ['E', 'F', 'G'].includes(group);
        const cycleLen = isEFG ? 21 : 20;
        const cycleData = isEFG ? this.EFG_CYCLE : this.CYCLE_4B3R;

        const results = [];
        for (let i = 0; i < count; i++) {
            const curIdx = (startIndex + i) % cycleLen;
            const rawItem = cycleData[curIdx];

            const item = {
                index: curIdx,
                shift: rawItem.shift,
                seq: rawItem.seq,
                max: rawItem.max,
                isOff: rawItem.shift === '休'
            };

            if (options.withRules) {
                item.rules = rawItem.rules || {};
                item.nativeSlots = rawItem.shift === '夜' ? [1] : (rawItem.shift === '早' ? [2, 3] : (rawItem.shift === '中' ? [4, 5] : []));
            }

            if (options.withAgent) {
                if (isEFG || item.isOff) {
                    item.agent = { full: "-", half: "-" };
                } else {
                    const groups = ['A', 'B', 'C', 'D'];
                    const baseIdx = groups.indexOf(group);
                    const decode = (offStr) => !offStr ? "-" : offStr.split('/').map(off => groups[(baseIdx + parseInt(off)) % 4]).join('/');
                    item.agent = {
                        full: decode(rawItem.a1),
                        half: decode(rawItem.a2)
                    };
                }
            }

            results.push(item);
        }
        return results;
    },

    // 支援 ABCD 與 EFG 的輪替位移推算
    getRotationOffsets(date, baseGroup, order = 1) {
        if (!baseGroup) return { cycle: 0, daily: 0 };
        const targetUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        
        let offsetCycle = 0;
        let offsetDaily = 0;

        if (['A', 'B', 'C', 'D'].includes(baseGroup)) {
            const ordinalDate = Math.floor(targetUTC / 86400000);
            const index = ordinalDate + this.STARTS_4B3R[baseGroup] + 200000;
            const cycle20 = Math.floor(index / 20);
            const remainder = index % 20; 
            
            let blockInCycle = remainder < 6 ? 0 : (remainder < 13 ? 1 : 2);
            offsetCycle = cycle20 * 3 + blockInCycle;
            
            let daysInCycle = 0;
            if (remainder < 5) daysInCycle = remainder;
            else if (remainder === 5) daysInCycle = 5;
            else if (remainder < 11) daysInCycle = 5 + (remainder - 6);
            else if (remainder < 13) daysInCycle = 10;
            else if (remainder < 18) daysInCycle = 10 + (remainder - 13);
            else daysInCycle = 15;
            
            offsetDaily = cycle20 * 15 + daysInCycle;
        } else if (['E', 'F', 'G'].includes(baseGroup)) {
            const dayDiff = Math.floor((targetUTC - this.EFG_BASE_DATE_UTC) / 86400000);
            const totalDays = dayDiff + this.EFG_OFFSETS[baseGroup];
            const cycle21 = Math.floor(totalDays / 21);
            let remainder = totalDays % 21;
            if (remainder < 0) remainder += 21;

            // 3班3輪：中(5天+2休) ➔ 早(6天+1休) ➔ 休1/夜(5天+1休)
            let blockInCycle = remainder < 7 ? 0 : (remainder < 14 ? 1 : 2);
            offsetCycle = cycle21 * 3 + blockInCycle;

            let daysInCycle = 0;
            if (remainder < 5) daysInCycle = remainder;
            else if (remainder < 7) daysInCycle = 5; // 休假
            else if (remainder < 13) daysInCycle = 5 + (remainder - 7);
            else if (remainder < 15) daysInCycle = 11; // 休假
            else if (remainder < 20) daysInCycle = 11 + (remainder - 15);
            else daysInCycle = 16; // 休假

            offsetDaily = cycle21 * 16 + daysInCycle;
        }

        if (order === -1) {
            offsetCycle = -offsetCycle; 
            offsetDaily = -offsetDaily;
        }
        return { cycle: offsetCycle, daily: offsetDaily };
    }
};