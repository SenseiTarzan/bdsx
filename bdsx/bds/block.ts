import { abstract } from "../common";
import { VoidPointer } from "../core";
import type { CxxVector } from "../cxxvector";
import { nativeClass, NativeClass, nativeField } from "../nativeclass";
import { bool_t, CxxString, CxxStringWith8Bytes, int32_t, uint16_t } from "../nativetype";
import type { BlockPos, ChunkPos } from "./blockpos";
import type { ChunkSource, LevelChunk } from "./chunk";
import type { CommandName } from "./commandname";
import { HashedString } from "./hashedstring";
import type { Container } from "./inventory";
import { CompoundTag, NBT } from "./nbt";

@nativeClass(null)
export class BlockLegacy extends NativeClass {
    @nativeField(VoidPointer)
    vftable:VoidPointer;
    /**
     * @deprecated Use `this.getRenderBlock().getDescriptionId()` instead
     */
    @nativeField(CxxString)
    descriptionId:CxxString;

    getCommandName():string {
        const names = this.getCommandNames2();
        const name = names.get(0).name;
        names.destruct();
        if (name === null) throw Error(`block has not any names`);
        return name;
    }
    /**
     * @deprecated Use `this.getCommandNames2()` instead
     */
    getCommandNames():CxxVector<CxxStringWith8Bytes> {
        abstract();
    }
    getCommandNames2():CxxVector<CommandName> {
        abstract();
    }
    /**
     * Returns the category of the block in creative inventory
     */
    getCreativeCategory():number {
        abstract();
    }
    /**
     * Changes the time needed to destroy the block
     * @remarks Will not affect actual destroy time but will affect the speed of cracks
     */
    setDestroyTime(time:number):void {
        abstract();
    }
    /**
     * Returns the time needed to destroy the block
     */
    getDestroyTime():number {
        return this.getFloat32(0x12C); // accessed in BlockLegacy::setDestroyTime
    }
    /**
     * Returns the Block instance
     */
    getRenderBlock():Block {
        abstract();
    }
    getBlockEntityType(): BlockActorType {
        abstract();
    }
}

@nativeClass(null)
export class Block extends NativeClass {
    @nativeField(VoidPointer)
    vftable:VoidPointer;
    @nativeField(uint16_t)
    data:uint16_t;
    @nativeField(BlockLegacy.ref(), 0x10)
    blockLegacy:BlockLegacy;

    /**
     * @param blockName Formats like 'minecraft:wool' and 'wool' are both accepted
     */
    static constructWith(blockName:BlockId, data?: number):Block|null;
    static constructWith(blockName:string, data?: number):Block|null;
    static constructWith(blockName:BlockId|string, data:number = 0):Block|null {
        abstract();
    }

    static create(blockName:BlockId, data?: number):Block|null;
    static create(blockName:string, data?: number):Block|null;

    /**
     * @param blockName Formats like 'minecraft:wool' and 'wool' are both accepted
     */
    static create(blockName:string, data:number = 0):Block|null {
        return this.constructWith(blockName, data);
    }
    protected _getName():HashedString {
        abstract();
    }
    getName():string {
        return this._getName().str;
    }
    getDescriptionId():CxxString {
        abstract();
    }
    getRuntimeId():int32_t {
        abstract();
    }
    getBlockEntityType(): BlockActorType {
        abstract();
    }
}

// Neighbors causes block updates around
// Network causes the block to be sent to clients
// Uses of other flags unknown
enum BlockUpdateFlags {
    NONE      = 0b0000,
    NEIGHBORS = 0b0001,
    NETWORK   = 0b0010,
    NOGRAPHIC = 0b0100,
    PRIORITY  = 0b1000,

    ALL = NEIGHBORS | NETWORK,
    ALL_PRIORITY = ALL | PRIORITY,
}
@nativeClass(null)
export class BlockSource extends NativeClass {
    @nativeField(VoidPointer)
    vftable:VoidPointer;
    @nativeField(VoidPointer)
    ownerThreadID:VoidPointer;
    @nativeField(bool_t)
    allowUnpopulatedChunks:bool_t;
    @nativeField(bool_t)
    publicSource:bool_t;

    protected _setBlock(x:number, y:number, z:number, block:Block, updateFlags:number):boolean {
        abstract();
    }
    getBlock(blockPos:BlockPos):Block {
        abstract();
    }
    /**
     *
     * @param blockPos Position of the block to place
     * @param block The Block to place
     * @param updateFlags BlockUpdateFlags, to place without ticking neighbor updates use only BlockUpdateFlags.NETWORK
     * @returns true if the block was placed, false if it was not
     */
    setBlock(blockPos:BlockPos, block:Block, updateFlags = BlockUpdateFlags.ALL):boolean {
        return this._setBlock(blockPos.x, blockPos.y, blockPos.z, block, updateFlags);
    }
    getChunk(pos:ChunkPos):LevelChunk|null {
        abstract();
    }
    getChunkAt(pos:BlockPos):LevelChunk|null {
        abstract();
    }
    getChunkSource():ChunkSource {
        abstract();
    }
    getBlockEntity(blockPos:BlockPos):BlockActor|null {
        abstract();
    }
}

@nativeClass(null)
export class BlockActor extends NativeClass {
    @nativeField(VoidPointer)
    vftable:VoidPointer;

    /**
     * @param tag this function stores nbt values to this parameter
     */
    save(tag:CompoundTag):boolean;
    /**
     * it returns JS converted NBT
     */
    save():Record<string, any>;
    save(tag?:CompoundTag):any{
        abstract();
    }
    load(tag:CompoundTag|NBT.Compound):void{
        abstract();
    }
    /**
     * @deprecated use allocateAndSave
     */
    constructAndSave():CompoundTag{
        const tag = CompoundTag.construct();
        this.save(tag);
        return tag;
    }
    allocateAndSave():CompoundTag{
        const tag = CompoundTag.allocate();
        this.save(tag);
        return tag;
    }
    setChanged(): void{
        abstract();
    }
    getContainer(): Container | null{
        abstract();
    }
    getType(): BlockActorType {
        abstract();
    }
}

export enum BlockActorType {
    None = 0x00,
    Furnace = 0x01,
    Chest = 0x02,
    NetherReactor = 0x03,
    Sign = 0x04,
    MobSpawner = 0x05,
    Skull = 0x06,
    FlowerPot = 0x07,
    BrewingStand = 0x08,
    EnchantingTable = 0x09,
    DaylightDetector = 0x0a,
    Music = 0x0b,
    Comparator = 0x0c,
    Dispenser = 0x0d,
    Dropper = 0x0e,
    Hopper = 0x0f,
    Cauldron = 0x10,
    ItemFrame = 0x11,
    Piston = 0x12,
    MovingBlock = 0x13,
    Beacon = 0x15,
    EndPortal = 0x16,
    EnderChest = 0x17,
    EndGateway = 0x18,
    ShulkerBox = 0x19,
    CommandBlock = 0x1a,
    Bed = 0x1b,
    Banner = 0x1c,
    StructureBlock = 0x20,
    Jukebox = 0x21,
    ChemistryTable = 0x22,
    Conduit = 0x23,
    Jigsaw = 0x24,
    Lectern = 0x25,
    BlastFurnace = 0x26,
    Smoker = 0x27,
    Bell = 0x28,
    Campfire = 0x29,
    Barrel = 0x2a,
    Beehive = 0x2b,
    Lodestone = 0x2c,
    SculkSensor = 0x2d,
    SporeBlossom = 0x2e,
    SculkCatalyst = 0x30,
}

@nativeClass(null)
export class ButtonBlock extends BlockLegacy {
    // unknown
}
